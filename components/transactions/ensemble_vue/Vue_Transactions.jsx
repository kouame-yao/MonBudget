import { ArrowDown, ArrowUp, Database, Wallet } from "lucide-react";

import { useAuth } from "../../../Auth/Authentification";

export default function Vue_Transactions() {
  const { Get_transactions, devise } = useAuth();

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

  // calcule taux revenu

  const calculateMonthlyEvolution = (transactions) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = now.getFullYear();
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let revenusActuels = 0;
    let revenusPrecedents = 0;
    let depensesActuelles = 0;
    let depensesPrecedentes = 0;

    transactions.forEach((t) => {
      const d = t.Date_at?.seconds
        ? new Date(t.Date_at.seconds * 1000)
        : new Date(t.Date_at);

      if (t.Type === "Revenu") {
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          revenusActuels += t.Montant || 0;
        } else if (
          d.getMonth() === previousMonth &&
          d.getFullYear() === previousYear
        ) {
          revenusPrecedents += t.Montant || 0;
        }
      } else if (t.Type === "Dépense") {
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          depensesActuelles += t.Montant || 0;
        } else if (
          d.getMonth() === previousMonth &&
          d.getFullYear() === previousYear
        ) {
          depensesPrecedentes += t.Montant || 0;
        }
      }
    });

    const evolutionRevenus =
      revenusPrecedents === 0
        ? revenusActuels > 0
          ? 100
          : 0
        : ((revenusActuels - revenusPrecedents) / revenusPrecedents) * 100;

    const evolutionDepenses =
      depensesPrecedentes === 0
        ? depensesActuelles > 0
          ? 100
          : 0
        : ((depensesActuelles - depensesPrecedentes) / depensesPrecedentes) *
          100;

    return {
      revenus: {
        actuels: revenusActuels,
        precedents: revenusPrecedents,
        evolution: evolutionRevenus,
      },
      depenses: {
        actuelles: depensesActuelles,
        precedentes: depensesPrecedentes,
        evolution: evolutionDepenses,
      },
    };
  };
  const resultats = calculateMonthlyEvolution(Get_transactions);
  const soldeNet = resultats.revenus.actuels - resultats.depenses.actuelles;
  const Statique = [
    {
      name: "Total",
      solde:
        SoldeActuelle >= 0
          ? `+ ${resultats.revenus.actuels} ${devise}`
          : `- ${resultats.revenus.actuels} ${devise}`,
      text: "Ce mois",
      icon: <Database size={16} />,
      color: "text-blue-500",
    },
    {
      name: "Revenus",
      solde:
        resultats.revenus.actuels > resultats.revenus.precedents
          ? ` ${resultats.revenus.actuels} ${devise}`
          : ` ${resultats.revenus.actuels} ${devise}`,
      text:
        resultats.revenus.actuels > resultats.revenus.precedents
          ? `+${resultats.revenus.evolution.toFixed(2)}% vs mois dernier`
          : `${resultats.revenus.evolution.toFixed(2)}% vs mois dernier`,
      icon:
        resultats.revenus.actuels > resultats.revenus.precedents ? (
          <ArrowUp size={16} />
        ) : (
          <ArrowDown size={16} />
        ),
      color:
        resultats.revenus.actuels > resultats.revenus.precedents
          ? "text-green-500"
          : "text-red-500",
    },
    {
      name: "Dépenses",
      solde:
        resultats.depenses.actuelles < resultats.depenses.precedentes
          ? `- ${resultats.depenses.actuelles} ${devise}`
          : `+ ${resultats.depenses.actuelles} ${devise}`,
      text: `${resultats.depenses.evolution.toFixed(2)}% vs mois dernier`,
      icon:
        resultats.depenses.actuelles < resultats.depenses.precedentes ? (
          <ArrowDown size={16} />
        ) : (
          <ArrowUp size={16} />
        ),
      color:
        resultats.depenses.actuelles < resultats.depenses.precedentes
          ? "text-orange-500"
          : "text-red-500",
    },
    {
      name: "Solde net",
      solde:
        soldeNet >= 0 ? `+ ${soldeNet} ${devise}` : `${soldeNet} ${devise}`,
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
