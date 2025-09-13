import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "../../../Auth/Authentification";

export default function CategoryPieChart() {
  const { Get_transactions, loading, devise } = useAuth();

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-xl p-3 w-full animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="flex items-center">
          <div className="w-1/2 h-48 bg-gray-200 rounded"></div>
          <div className="ml-2 flex-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between mb-1">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const groupByType = (data) => {
    const compte = {};
    for (let doc of data) {
      if (!compte[doc.Type]) compte[doc.Type] = [];
      compte[doc.Type].push(doc);
    }
    return compte;
  };

  // Filtrer les transactions selon le mois sélectionné
  const [year, month] = selectedMonth.split("-").map((s) => Number(s));
  const filteredTransactions = (Get_transactions || []).filter((t) => {
    if (!t?.Date_at) return false;
    const d = t.Date_at?.seconds
      ? new Date(t.Date_at.seconds * 1000)
      : new Date(t.Date_at);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const TypeTrans = groupByType(filteredTransactions);

  const transformCategoriesData = (depenses) => {
    const categories = {};
    depenses?.forEach((transaction) => {
      const categorie = transaction.Categorie;
      if (!categories[categorie])
        categories[categorie] = { name: categorie, value: 0 };
      const montant =
        typeof transaction.Montant === "string"
          ? parseFloat(transaction.Montant)
          : transaction.Montant;
      categories[categorie].value += montant;
    });

    const colors = [
      "#ef4444",
      "#f59e0b",
      "#8b5cf6",
      "#ec4899",
      "#06b6d4",
      "#22c55e",
      "#f97316",
      "#6366f1",
      "#84cc16",
      "#e11d48",
    ];

    return Object.values(categories)
      .map((cat, index) => ({ ...cat, color: colors[index % colors.length] }))
      .sort((a, b) => b.value - a.value);
  };

  const chartData = transformCategoriesData(TypeTrans?.Dépense);

  const monthLabel = new Date(year, month - 1).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white shadow rounded-xl p-3 w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-semibold">Répartition par catégorie</h2>
          <p className="text-base text-gray-500">Dépenses pour {monthLabel}</p>
        </div>
        <div>
          <input
            aria-label="Sélectionner le mois"
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-200 rounded p-1"
          />
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="flex items-center">
          <ResponsiveContainer width="50%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}${devise}`, "Montant"]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="ml-2">
            {chartData.map((item, i) => (
              <div key={i} className="flex justify-between gap-4 text-xs mb-1">
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: item.color }}
                  ></span>
                  {item.name}
                </span>
                <span className="font-medium text-sm">
                  {item.value}
                  {devise}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-500">
          <p className="text-sm">Aucune dépense disponible pour ce mois</p>
        </div>
      )}
    </div>
  );
}
