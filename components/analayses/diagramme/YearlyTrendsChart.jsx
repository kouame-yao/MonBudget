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
import { useAuth } from "../../../Auth/Authentification";

export default function YearlyTrendsChart() {
  const { Get_transactions, loading, devise } = useAuth();
  const [monthlyData, setMonthlyData] = useState([]);
  const [savingRate, setSavingRate] = useState([]);

  useEffect(() => {
    if (!Get_transactions || Get_transactions.length === 0) return;

    const currentYear = new Date().getFullYear();
    const monthlyMap = {};

    // Parcours des transactions et filtrage sur l'année en cours
    Get_transactions.forEach((t) => {
      const date = t.Date_at?.toDate ? t.Date_at.toDate() : new Date(t.Date_at);
      if (date.getFullYear() !== currentYear) return; // ignore les autres années

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

    // Mois de l'année courante
    const monthsOrder = [
      "janv.",
      "févr.",
      "mars",
      "avr.",
      "mai",
      "juin",
      "juil.",
      "août",
      "sept.",
      "oct.",
      "nov.",
      "déc.",
    ].map((m) => `${m} ${currentYear}`);

    // Création du tableau pour Recharts
    const data = monthsOrder.map((month) => {
      const { revenus = 0, depenses = 0 } = monthlyMap[month] || {};
      const epargne = revenus - depenses;
      return {
        month: month.replace(`${currentYear}`, "").replace(".", ""),
        revenus,
        depenses,
        epargne: epargne > 0 ? epargne : 0,
      };
    });

    setMonthlyData(data);
    setSavingRate(
      data.map((d) => ({
        month: d.month,
        taux: d.revenus > 0 ? Math.round((d.epargne / d.revenus) * 100) : 0,
      }))
    );
  }, [Get_transactions]);

  const totalEpargne = monthlyData.reduce((sum, m) => sum + m.epargne, 0);
  const avgTaux =
    monthlyData.reduce(
      (sum, m) => sum + (m.revenus > 0 ? (m.epargne / m.revenus) * 100 : 0),
      0
    ) / monthlyData.length || 0;

  const improvement = 15; // valeur fixe ou calculable selon tes besoins

  if (loading || monthlyData.length === 0)
    return (
      <div className="bg-white shadow rounded-xl p-3 w-full animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-60 bg-gray-200 rounded"></div>
      </div>
    );

  return (
    <div className="bg-white shadow rounded-xl p-3 w-full">
      <h2 className="text-xl font-semibold">Tendances annuelles</h2>
      <p className="text-sm text-gray-500 mb-2">
        Évolution de vos finances sur 12 mois
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ResponsiveContainer width="100%" height={250}>
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

        <ResponsiveContainer width="100%" height={250}>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-center">
        <div className="bg-green-100 rounded-xl py-2 font-bold text-green-700">
          <span className="text-2xl">{totalEpargne.toFixed(0)} {devise}</span> <br />
          <span className="text-base font-normal">Épargne totale</span>
        </div>
        <div className="bg-blue-100 rounded-xl py-2 font-bold text-blue-700">
          <span className="text-2xl">{avgTaux.toFixed(0)}%</span> <br />
          <span className="text-base font-normal">Taux d'épargne moyen</span>
        </div>
        <div className="bg-purple-100 rounded-xl py-2 font-bold text-purple-700">
          <span className="text-2xl">+{improvement}%</span> <br />
          <span className="text-base font-normal">
            Amélioration vs. année précédente
          </span>
        </div>
      </div>
    </div>
  );
}
