import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
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

export default function YearlyTrendsChart() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [savingRate, setSavingRate] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Récupérer toutes les transactions de l'utilisateur
  useEffect(() => {
    if (!isClient || !user?.uid) return;

    const colRef = collection(db, "users", user.uid, "transactions");
    const q = query(colRef, orderBy("Date_at", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allTransactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransactions(allTransactions);
    });

    return () => unsubscribe();
  }, [isClient, user?.uid]);

  // Grouper par mois
  useEffect(() => {
    if (transactions.length === 0) return;

    const monthlyMap = {};
    transactions.forEach((t) => {
      const date = t.Date_at?.toDate ? t.Date_at.toDate() : new Date(t.Date_at);
      const monthYear = date.toLocaleDateString("fr-FR", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyMap[monthYear])
        monthlyMap[monthYear] = { revenus: 0, depenses: 0 };

      const montant =
        typeof t.Montant === "string" ? parseFloat(t.Montant) : t.Montant;
      if (t.Type === "Revenu") monthlyMap[monthYear].revenus += montant;
      else if (t.Type === "Dépense") monthlyMap[monthYear].depenses += montant;
    });

    // Ordre des mois pour l'affichage
    const monthsOrder = [
      "janv. 2025",
      "févr. 2025",
      "mars 2025",
      "avr. 2025",
      "mai 2025",
      "juin 2025",
      "juil. 2025",
      "août 2025",
      "sept. 2025",
      "oct. 2025",
      "nov. 2025",
      "déc. 2025",
    ];

    const data = monthsOrder.map((month) => {
      const { revenus = 0, depenses = 0 } = monthlyMap[month] || {};
      const epargne = revenus - depenses;
      return {
        month: month.replace("2025", "").replace(".", ""),
        revenus,
        depenses,
        epargne: epargne > 0 ? epargne : 0,
      };
    });

    const rate = data.map((d) => ({
      month: d.month,
      taux: d.revenus > 0 ? Math.round((d.epargne / d.revenus) * 100) : 0,
    }));

    setMonthlyData(data);
    setSavingRate(rate);
  }, [transactions]);

  const totalEpargne = monthlyData.reduce((sum, m) => sum + m.epargne, 0);
  const avgTaux =
    monthlyData.reduce(
      (sum, m) => sum + (m.revenus > 0 ? (m.epargne / m.revenus) * 100 : 0),
      0
    ) / monthlyData.length || 0;
  const improvement = 15; // valeur fixe à adapter

  if (!isClient || monthlyData.length === 0) {
    return <div>Chargement des données...</div>;
  }

  return (
    <div className="bg-white shadow rounded-2xl p-4">
      <h2 className="text-3xl font-semibold">Tendances annuelles</h2>
      <p className="text-2xl text-gray-500 mb-4">
        Évolution de vos finances sur 12 mois
      </p>
      <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenus" fill="#22c55e" name="Revenus" />
            <Bar dataKey="depenses" fill="#ef4444" name="Dépenses" />
            <Bar dataKey="epargne" fill="#3b82f6" name="Épargne" />
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={savingRate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 35]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="taux"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Taux d'épargne"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 text-center">
        <div className="bg-green-100 rounded-xl py-4 font-bold text-green-700">
          <span className="text-4xl">{totalEpargne.toFixed(0)}€</span> <br />
          <span className="text-3xl font-normal">Épargne totale</span>
        </div>
        <div className="bg-blue-100 rounded-xl py-4 font-bold text-blue-700">
          <span className="text-4xl">{avgTaux.toFixed(0)}% </span> <br />
          <span className="text-3xl font-normal">Taux d'épargne moyen</span>
        </div>
        <div className="bg-purple-100 rounded-xl py-4 font-bold text-purple-700">
          <span className="text-4xl">+{improvement}%</span> <br />
          <span className="text-3xl font-normal">
            Amélioration vs. année précédente
          </span>
        </div>
      </div>
    </div>
  );
}
