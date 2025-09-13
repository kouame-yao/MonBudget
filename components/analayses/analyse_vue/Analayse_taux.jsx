import {
  ArrowDown,
  ArrowUp,
  BadgeEuro,
  HandCoins,
  PiggyBank,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../Auth/Authentification";

function Analayse_taux() {
  const { loading, Get_transactions, devise } = useAuth();
  const [transactions, setTransaction] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const date = new Date();
  const options = { year: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("fr-FR", options);

  if (loading) {
    return (
      <div className="flex gap-4 items-center">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white flex flex-col gap-4 w-full rounded-3xl p-10 border-4 border-gray-200 animate-pulse"
          >
            <div className="h-20 bg-gray-200 rounded-2xl"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        ))}
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

  // Filtrer les transactions pour ne garder que celles du mois courant
  const currentMonth = date.getMonth(); // 0-based
  const currentYear = date.getFullYear();
  const currentMonthTransactions = (Get_transactions || []).filter((t) => {
    if (!t?.Date_at) return false;
    const d = t.Date_at?.seconds
      ? new Date(t.Date_at.seconds * 1000)
      : new Date(t.Date_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const TypeTrans = groupByType(currentMonthTransactions);

  const sommeMontants = (data) => {
    if (!data || data.length === 0) return 0;
    return data.reduce((acc, element) => acc + (element.Montant || 0), 0);
  };

  const Depense = sommeMontants(TypeTrans.Dépense);
  const Revenu = sommeMontants(TypeTrans.Revenu);
  const SoldeActuelle = Revenu - Depense;
  const TauxEpargne =
    Revenu > 0 ? ((SoldeActuelle / Revenu) * 100).toFixed(1) : "0";
  // Nombre de jours du mois courant
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const MoyenneJournaliere =
    Depense > 0 ? (Depense / daysInMonth).toFixed(2) : "0";

  const maxTransaction =
    TypeTrans.Dépense.length > 0
      ? TypeTrans.Dépense.reduce(
          (max, t) => (t.Montant > (max.Montant || 0) ? t : max),
          TypeTrans.Dépense[0]
        )
      : { Categorie: "N/A" };

  const Statique = [
    {
      name: <PiggyBank size={20} />,
      solde: `${TauxEpargne}%`,
      text: "Taux d'épargne",
      trend: "up",
    },
    {
      name: <BadgeEuro size={20} />,
      solde: `${MoyenneJournaliere} ${devise}`,
      text: "Dépense moyenne/jour",
      trend: "down",
    },
    {
      name: <Utensils size={20} />,
      solde: maxTransaction.Categorie || "N/A",
      text: "Plus grosse catégorie",
      trend: null,
    },
    {
      name: <HandCoins size={20} />,
      solde:
        Revenu > 0 ? `${Math.round((SoldeActuelle / Revenu) * 100)}%` : "0%",
      text: "Objectif du mois",
      trend: "up",
    },
  ];

  return (
    <div className="flex gap-2 items-center flex-wrap">
      {Statique.map((items, index) => (
        <div
          key={index}
          className="bg-white flex flex-col gap-2 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] rounded-2xl p-3 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="w-10 h-10 rounded-xl grid place-items-center p-1 bg-gray-100">
              {items.name}
            </span>
            <span
              className={`text-base ${
                items.trend === "up"
                  ? "text-green-500"
                  : items.trend === "down"
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {items.trend === "up" ? (
                <ArrowUp size={14} />
              ) : items.trend === "down" ? (
                <ArrowDown size={14} />
              ) : null}
            </span>
          </div>
          <span className="text-xl font-bold">{items.solde}</span>
          <span className="text-sm font-light text-gray-500">{items.text}</span>
        </div>
      ))}
    </div>
  );
}

export default Analayse_taux;
