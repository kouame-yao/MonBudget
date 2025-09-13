import { useState } from "react";
import { useAuth } from "../../../Auth/Authentification";

// Sélecteur de mois pour filtrer les statistiques

export default function Statistiques_rapides() {
  const { Get_transactions, devise } = useAuth();

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [year, month] = selectedMonth.split("-").map((s) => Number(s));

  const TypeTransactio = (data) => {
    const compte = { Dépense: [], Revenu: [] };
    data.forEach((doc) => {
      if (doc.Type === "Dépense" || doc.Type === "Revenu") {
        compte[doc.Type].push(doc);
      }
    });
    return compte;
  };

  // Filtrer les transactions pour le mois sélectionné
  const filteredTransactions = (Get_transactions || []).filter((t) => {
    if (!t?.Date_at) return false;
    const d = t.Date_at?.seconds
      ? new Date(t.Date_at.seconds * 1000)
      : new Date(t.Date_at);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });

  const TypeTrans = TypeTransactio(filteredTransactions);

  const CalculeTotal = (data) => {
    if (!data || data.length === 0) return 0;
    return data.reduce((acc, element) => acc + (element.Montant || 0), 0);
  };

  const Depense = CalculeTotal(TypeTrans.Dépense);
  const Revenu = CalculeTotal(TypeTrans.Revenu);
  const SoldeActuelle = Revenu - Depense;
  const TauxEparge =
    Revenu > 0 ? Math.round((SoldeActuelle / Revenu) * 100) : 0;

  const MoyenneJournaliere = Depense > 0 ? Depense / 30 : 0;
  const GrosseDepense =
    TypeTrans.Dépense.length > 0
      ? Math.max(...TypeTrans.Dépense.map((t) => t.Montant || 0))
      : 0;

  const maxTransaction =
    TypeTrans.Dépense.length > 0
      ? TypeTrans.Dépense.reduce(
          (max, t) => (t.Montant > (max.Montant || 0) ? t : max),
          TypeTrans.Dépense[0]
        )
      : { Categorie: "Aucune dépense" };

  const states = [
    {
      text: "Moyenne journalière",
      valu:
        MoyenneJournaliere > 0
          ? `- ${MoyenneJournaliere.toFixed(0)} ${devise}`
          : "0 Fr",
    },
    {
      text: "Plus grosse dépense",
      valu:
        GrosseDepense > 0
          ? `- ${GrosseDepense.toFixed(2)} ${devise}`
          : `${devise}`,
    },
    {
      text: "Catégorie principale",
      valu: maxTransaction.Categorie || "Aucune dépense",
    },
    {
      text: "Objectif mensuel",
      valu: TauxEparge > 0 ? `${TauxEparge}%` : "0%",
    },
  ];

  return (
    <div className="">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-4 sm:p-6 md:p-8 flex flex-col gap-4 sm:gap-6">
        <span className="text-xl sm:text-2xl md:text-3xl font-semibold">
          Statistiques rapides
        </span>

        <div className="flex flex-col gap-3 sm:gap-4">
          {states.map((items, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-sm sm:text-base md:text-lg"
            >
              <span className="font-light">{items.text}</span>
              <span
                className={`font-semibold ${
                  index === 0 || index === 1
                    ? "text-red-600"
                    : index === 3
                    ? "text-green-600"
                    : "text-gray-800"
                }`}
              >
                {items.valu}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
