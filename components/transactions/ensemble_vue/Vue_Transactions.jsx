import { ArrowDown, ArrowUp, Database, Wallet } from "lucide-react";

import { useAuth } from "../../../Auth/Authentification";

export default function Vue_Transactions() {
  const { Get_transactions } = useAuth();

  const TypeTransactio = (data) => {
    const compte = { Dépense: [], Revenu: [] };
    data.forEach((doc) => {
      if (doc.Type === "Dépense" || doc.Type === "Revenu")
        compte[doc.Type].push(doc);
    });
    return compte;
  };

  const TypeTrans = TypeTransactio(Get_transactions);
  const CalculeTotal = (data) =>
    data?.length ? data.reduce((acc, el) => acc + (el.Montant || 0), 0) : 0;

  const Depense = CalculeTotal(TypeTrans.Dépense);
  const Revenu = CalculeTotal(TypeTrans.Revenu);
  const SoldeActuelle = Revenu - Depense;

  const Statique = [
    {
      name: "Total",
      solde:
        SoldeActuelle >= 0
          ? `+ ${SoldeActuelle.toFixed(2)} Fr`
          : `- ${Math.abs(SoldeActuelle).toFixed(2)} Fr`,
      text: "Ce mois",
      icon: <Database size={16} />,
      color: "text-blue-500",
    },
    {
      name: "Revenus",
      solde: Revenu > 0 ? `+ ${Revenu.toFixed(2)} Fr` : "Aucun revenu",
      text: "+12% vs mois dernier",
      icon: <ArrowUp size={16} />,
      color: "text-green-500",
    },
    {
      name: "Dépenses",
      solde: Depense > 0 ? `- ${Depense.toFixed(2)} Fr` : "Aucune dépense",
      text: "-8% vs mois dernier",
      icon: <ArrowDown size={16} />,
      color: "text-red-500",
    },
    {
      name: "Solde net",
      solde:
        SoldeActuelle >= 0
          ? `+ ${SoldeActuelle.toFixed(2)} Fr`
          : `- ${Math.abs(SoldeActuelle).toFixed(2)} Fr`,
      text: "Différence mensuelle",
      icon: <Wallet size={16} />,
      color: SoldeActuelle >= 0 ? "text-green-500" : "text-red-500",
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      {Statique.map((item, idx) => (
        <div
          key={idx}
          className="bg-white flex flex-col gap-1 p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm w-full sm:w-1/4"
        >
          <div className="flex justify-between items-center text-sm font-semibold text-gray-500">
            <span>{item.name}</span>
            <span className={item.color}>{item.icon}</span>
          </div>
          <span className={`text-base sm:text-lg font-bold ${item.color}`}>
            {item.solde}
          </span>
          <span className="text-xs text-gray-400">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
