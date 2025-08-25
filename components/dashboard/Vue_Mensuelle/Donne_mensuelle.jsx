import { collection, onSnapshot } from "firebase/firestore";
import { ArrowBigDown, ArrowBigUp, Calendar, WalletIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../Auth/Authentification";
import { db } from "../../../database/firebase/auth";

export default function Donne_mensuelle() {
  const { user, loading } = useAuth(); // j’ai retiré connectGoogle & logout, inutiles ici
  const [transactions, setTransaction] = useState([]);

  // Date formatée en français (ex: août 2025)
  const date = new Date();
  const options = { year: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("fr-FR", options);

  useEffect(() => {
    if (loading) return; // Auth pas encore prêt
    if (!user?.uid) return; // Pas connecté → ne lance pas Firestore

    console.log("db:", !!db, "uid:", user?.uid);

    // ⚠️ structure Firestore : users/{uid}/transactions/{mois}/docs
    const colRef = collection(db, "users", user.uid, "transactions");

    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const table = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const montant =
          typeof data.Montant === "string"
            ? parseFloat(data.Montant)
            : data.Montant;
        table.push({ id: doc.id, ...data, Montant: montant || 0 });
      });
      setTransaction(table);
    });

    return () => unsubscribe();
  }, [loading, user?.uid, formatted]);

  // --- Helpers ---
  const TypeTransactio = (data) => {
    const compte = { Dépense: [], Revenu: [] };
    data.forEach((doc) => {
      if (doc.Type === "Dépense" || doc.Type === "Revenu") {
        compte[doc.Type].push(doc);
      }
    });
    return compte;
  };

  const TypeTrans = TypeTransactio(transactions);

  const CalculeTotal = (data) =>
    data && data.length > 0
      ? data.reduce((acc, element) => acc + (element.Montant || 0), 0)
      : 0;

  const Depense = CalculeTotal(TypeTrans.Dépense);
  const Revenu = CalculeTotal(TypeTrans.Revenu);
  const SoldeActuelle = Revenu - Depense;
  const TauxEparge =
    Revenu > 0 ? Math.round((SoldeActuelle / Revenu) * 100) : 0;

  const difDonner = [
    {
      somme:
        SoldeActuelle >= 0
          ? `+ ${SoldeActuelle.toFixed(2)} Fr`
          : `- ${Math.abs(SoldeActuelle).toFixed(2)} Fr`,
      text: "Solde actuel",
      icon: <WalletIcon size={40} />,
      bgdiv: "bg-blue-200",
      bgicon: "bg-blue-300",
      textcolor: SoldeActuelle >= 0 ? "text-blue-500" : "text-red-500",
    },
    {
      somme: Revenu > 0 ? `+ ${Revenu.toFixed(2)} Fr` : "Aucun revenu",
      text: "Revenus ce mois",
      icon: <ArrowBigUp size={40} />,
      bgdiv: "bg-green-200",
      bgicon: "bg-green-300",
      textcolor: "text-green-500",
    },
    {
      somme: Depense > 0 ? `- ${Depense.toFixed(2)} Fr` : "Aucune dépense",
      text: "Dépenses ce mois",
      icon: <ArrowBigDown size={40} />,
      bgdiv: "bg-red-200",
      bgicon: "bg-red-300",
      textcolor: "text-red-500",
    },
  ];

  return (
    <div>
      <div className="bg-white p-6 md:p-10 rounded-3xl md:max-w-full border-2 shadow-md border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Vue mensuelle</h1>
          <p className="text-lg md:text-2xl flex items-center gap-2 text-gray-500 font-light">
            <Calendar size={20} /> {formatted}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-b-2 border-gray-200 py-6 md:py-10">
          {difDonner.map((items, index) => (
            <div
              key={index}
              className={`rounded-2xl w-full ${items.bgdiv} p-4 md:p-6 flex flex-col gap-3 md:gap-4 items-center`}
            >
              <span
                className={`w-12 h-12 md:w-16 md:h-16 ${items.bgicon} ${items.textcolor} rounded-2xl flex items-center justify-center shadow-sm`}
              >
                {items.icon}
              </span>
              <p className={`text-xl md:text-3xl font-bold ${items.textcolor}`}>
                {items.somme}
              </p>
              <span className="text-sm md:text-xl font-light text-gray-500 text-center">
                {items.text}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-6 md:mt-8 gap-4">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-2xl md:text-3xl font-semibold">
              Résultat mensuel
            </span>
            <span className="text-lg md:text-2xl font-light text-gray-500">
              Différence entre revenus et dépenses
            </span>
          </div>
          <div className="flex flex-col gap-2 text-center md:text-right">
            <span
              className={`text-2xl md:text-3xl font-semibold ${
                SoldeActuelle >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {SoldeActuelle.toFixed(2)} €
            </span>
            <span className="text-lg md:text-2xl font-light text-green-500">
              Taux d'épargne: {TauxEparge}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
