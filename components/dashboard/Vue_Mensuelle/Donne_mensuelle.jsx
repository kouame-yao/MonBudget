import { ArrowBigDown, ArrowBigUp, Calendar, WalletIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../Auth/Authentification";

export default function Donne_mensuelle() {
  const { Get_transactions, devise } = useAuth();

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [year, month] = selectedMonth.split("-").map((s) => Number(s));
  const monthLabel = new Date(year, month - 1).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });

  const TypeTransactio = (data) => {
    const compte = { Dépense: [], Revenu: [] };
    data.forEach((doc) => {
      if (doc.Type === "Dépense" || doc.Type === "Revenu")
        compte[doc.Type].push(doc);
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
  const CalculeTotal = (data) =>
    data && data.length > 0
      ? data.reduce((acc, el) => acc + (el.Montant || 0), 0)
      : 0;

  const Depense = CalculeTotal(TypeTrans.Dépense);
  const Revenu = CalculeTotal(TypeTrans.Revenu);
  const SoldeActuelle = Revenu - Depense;

  const calculateMonthlyEvolution = (transactions, yearSel, monthSel) => {
    const currentMonth = monthSel - 1; // monthSel is 1-based
    const currentYear = yearSel;
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
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

  const resultats = calculateMonthlyEvolution(Get_transactions, year, month);
  const soldeNet = resultats.revenus.actuels - resultats.depenses.actuelles;
  const TauxEparge =
    resultats.revenus.actuels > 0
      ? Math.round((soldeNet / resultats.revenus.actuels) * 100)
      : 0;
  const difDonner = [
    {
      somme:
        soldeNet >= 0 ? ` +${soldeNet} ${devise}` : ` ${soldeNet} ${devise}`,
      text: "Solde actuel",
      icon: <WalletIcon size={20} />,
      bgdiv: "bg-blue-100",
      bgicon: "bg-blue-300",
      textcolor: SoldeActuelle >= 0 ? "text-blue-500" : "text-red-500",
    },
    {
      somme:
        resultats.revenus.actuels > resultats.revenus.precedents
          ? `${resultats.revenus.actuels} ${devise}`
          : `${resultats.revenus.actuels}${devise}`,
      text: "Revenus ce mois",
      icon:
        resultats.revenus.actuels > resultats.revenus.precedents ? (
          <ArrowBigUp size={20} />
        ) : (
          <ArrowBigDown size={20} />
        ),
      bgdiv:
        resultats.revenus.actuels > resultats.revenus.precedents
          ? "bg-green-100"
          : "bg-red-100",
      bgicon:
        resultats.revenus.actuels > resultats.revenus.precedents
          ? "bg-green-300"
          : "bg-red-300",
      textcolor:
        resultats.revenus.actuels > resultats.revenus.precedents
          ? "text-green-500"
          : "text-red-500",
    },
    {
      somme:
        resultats.depenses.actuelles < resultats.depenses.precedentes
          ? `- ${resultats.depenses.actuelles} ${devise}`
          : `+ ${resultats.depenses.actuelles} ${devise}`,
      text: "Dépenses ce mois",
      icon: <ArrowBigDown size={20} />,
      bgdiv: "bg-red-100",
      bgicon: "bg-red-300",
      textcolor: "text-red-500",
    },
  ];

  return (
    <div className="">
      <div className="bg-white p-3 sm:p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
              Vue mensuelle
            </h1>
            <p className="text-xs sm:text-sm md:text-base flex items-center gap-1 text-gray-500 font-light">
              <Calendar size={14} /> {monthLabel}
            </p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 py-3 sm:py-4 md:py-6 border-b border-gray-200">
          {difDonner.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg w-full ${item.bgdiv} p-2 sm:p-3 md:p-4 flex flex-col gap-1 sm:gap-2 items-center`}
            >
              <span
                className={`w-8 h-8 sm:w-10 sm:h-10 ${item.bgicon} ${item.textcolor} rounded-lg flex items-center justify-center`}
              >
                {item.icon}
              </span>
              <p
                className={`text-sm sm:text-base md:text-lg font-bold ${item.textcolor}`}
              >
                {item.somme}
              </p>
              <span className="text-xs sm:text-sm md:text-base font-light text-gray-500 text-center">
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-3 sm:mt-4 md:mt-5 gap-1 sm:gap-2">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-lg sm:text-xl md:text-2xl font-semibold">
              Résultat mensuel
            </span>
            <span className="text-xs sm:text-sm md:text-base font-light text-gray-500">
              Différence entre revenus et dépenses
            </span>
          </div>
          <div className="flex flex-col gap-1 text-center md:text-right">
            <span
              className={`text-lg sm:text-xl md:text-2xl font-semibold ${
                SoldeActuelle >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {soldeNet} {devise}
            </span>
            <span className="text-xs sm:text-sm md:text-base font-light text-green-500">
              Taux d'épargne: {TauxEparge}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
