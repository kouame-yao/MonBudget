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
  const { user } = useAuth();
  const [transactions, setTransaction] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const date = new Date();
  const formatted = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient || !user?.uid) return;
    const colRef = collection(db, "users", user?.uid, "transactions");
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const table = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        table.push({
          id: doc.id,
          ...data,
          Montant:
            typeof data.Montant === "string"
              ? parseFloat(data.Montant)
              : data.Montant,
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
      <div className="bg-white shadow rounded-xl p-3 w-full animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-60 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const groupByType = (data) => {
    const compte = { Dépense: [], Revenu: [] };
    data.forEach((doc) => {
      if (doc.Type === "Dépense" || doc.Type === "Revenu")
        compte[doc.Type].push(doc);
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
    for (let day = 1; day <= daysInMonth; day++)
      dailyData[day] = { day, revenus: 0, depenses: 0 };
    TypeTrans.Dépense?.forEach((t) => {
      dailyData[t.Date_at.getDate()].depenses += t.Montant || 0;
    });
    TypeTrans.Revenu?.forEach((t) => {
      dailyData[t.Date_at.getDate()].revenus += t.Montant || 0;
    });
    return Object.values(dailyData).sort((a, b) => a.day - b.day);
  };

  const chartData = transformDataForChart(TypeTrans);

  return (
    <div className="bg-white shadow rounded-xl p-3 w-full">
      <h2 className="text-xl font-semibold">Flux financiers quotidiens</h2>
      <p className="text-sm text-gray-500 mb-2">
        Évolution de vos revenus et dépenses ce mois
      </p>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
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
        <div className="h-60 flex items-center justify-center text-gray-500">
          <p className="text-sm">Aucune donnée disponible pour ce mois</p>
        </div>
      )}
    </div>
  );
}
