import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { db } from "../../../database/firebase/auth";
import { useAuth } from "../../../Auth/Authentification";

export default function DailyFlowChart() {
  const { user, connectGoogle, logout } = useAuth();
  const [transactions, setTransaction] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const date = new Date();
  const options = { year: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("fr-FR", options);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if ((!isClient, !user?.uid)) return;
    const colRef = collection(db, "users", user?.uid, "transactions");
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const table = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const montant =
          typeof data.Montant === "string"
            ? parseFloat(data.Montant)
            : data.Montant;
        table.push({
          id: doc.id,
          ...data,
          Montant: montant || 0,
          Date_at: data.Date_at?.toDate
            ? data.Date_at.toDate()
            : new Date(data.Date_at),
        });
      });
      setTransaction(table);
    });
    return () => unsubscribe();
  }, [formatted, isClient, user?.uid]);

  if (!isClient) {
    return (
      <div className="bg-white shadow rounded-2xl p-4 w-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const groupByType = (data) => {
    const compte = { Dépense: [], Revenu: [] };
    data.forEach((doc) => {
      if (doc.Type === "Dépense" || doc.Type === "Revenu") {
        compte[doc.Type].push(doc);
      }
    });
    return compte;
  };

  const TypeTrans = groupByType(transactions);

  const transformDataForChart = (TypeTrans) => {
    const dailyData = {};
    const daysInMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    // Initialiser tous les jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      dailyData[day] = { day, revenus: 0, depenses: 0 };
    }

    // Traiter les dépenses
    TypeTrans.Dépense?.forEach((transaction) => {
      const day = transaction.Date_at.getDate();
      if (dailyData[day]) {
        dailyData[day].depenses += transaction.Montant || 0;
      }
    });

    // Traiter les revenus
    TypeTrans.Revenu?.forEach((transaction) => {
      const day = transaction.Date_at.getDate();
      if (dailyData[day]) {
        dailyData[day].revenus += transaction.Montant || 0;
      }
    });

    // Convertir en tableau et trier par jour
    return Object.values(dailyData).sort((a, b) => a.day - b.day);
  };

  const chartData = transformDataForChart(TypeTrans);

  const sommeMontants = (data) => {
    if (!data || data.length === 0) return 0;
    return data.reduce((acc, element) => acc + (element.Montant || 0), 0);
  };

  const Depense = sommeMontants(TypeTrans.Dépense);
  const Revenu = sommeMontants(TypeTrans.Revenu);

  return (
    <div className="bg-white shadow rounded-2xl p-4 w-full">
      <h2 className="text-2xl md:text-3xl font-semibold">
        Flux financiers quotidiens
      </h2>
      <p className="text-lg md:text-2xl text-gray-500 mb-4">
        Évolution de vos revenus et dépenses ce mois
      </p>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} €`, "Montant"]}
              labelFormatter={(label) => `Jour ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenus"
              stroke="#22c55e"
              strokeWidth={2}
              name="Revenus"
            />
            <Line
              type="monotone"
              dataKey="depenses"
              stroke="#ef4444"
              strokeWidth={2}
              name="Dépenses"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-96 flex items-center justify-center text-gray-500">
          <p className="text-lg md:text-xl">
            Aucune donnée disponible pour ce mois
          </p>
        </div>
      )}
    </div>
  );
}
