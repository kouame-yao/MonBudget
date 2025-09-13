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
import { useAuth } from "../../../Auth/Authentification";

export default function DailyFlowChart() {
  const { Get_transactions, loading, devise } = useAuth();

  const date = new Date();

  if (loading) {
    return (
      <div className="bg-white shadow rounded-xl p-3 w-full animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-60 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Filtrer les transactions pour le mois courant
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const currentMonthTransactions = (Get_transactions || []).filter((t) => {
    if (!t?.Date_at) return false;
    const d = t.Date_at?.seconds
      ? new Date(t.Date_at.seconds * 1000)
      : new Date(t.Date_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const groupByType = (data) => {
    const compte = { Dépense: [], Revenu: [] };
    data.forEach((doc) => {
      if (doc.Type === "Dépense" || doc.Type === "Revenu")
        compte[doc.Type].push(doc);
    });
    return compte;
  };

  const TypeTrans = groupByType(currentMonthTransactions);

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
      const day =
        t.Date_at?.toDate?.()?.getDate() || new Date(t.Date_at).getDate();
      if (dailyData[day]) {
        dailyData[day].depenses += Number(t.Montant) || 0;
      }
    });

    TypeTrans.Revenu?.forEach((t) => {
      const day =
        t.Date_at?.toDate?.()?.getDate() || new Date(t.Date_at).getDate();
      if (dailyData[day]) {
        dailyData[day].revenus += Number(t.Montant) || 0;
      }
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
              formatter={(value) => [`${value} ${devise}`, "Montant"]}
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
