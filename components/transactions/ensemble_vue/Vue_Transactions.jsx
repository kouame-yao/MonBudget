import { collection, onSnapshot } from "firebase/firestore";
import { ArrowDown, ArrowUp, Database, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../../../database/firebase/auth";
import { useAuth } from "../../../Auth/Authentification";

function Vue_Transactions() {
  const { user, connectGoogle, logout, loading } = useAuth();
  const uid = user?.uid;
  const [transactions, setTransaction] = useState([]);
  const date = new Date();
  const options = { year: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("fr-FR", options);

  useEffect(() => {
    if (loading) return;
    const colRef = collection(db, "users", uid, "transactions");
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const table = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // S'assurer que Montant est un nombre
        const montant =
          typeof data.Montant === "string"
            ? parseFloat(data.Montant)
            : data.Montant;
        table.push({ id: doc.id, ...data, Montant: montant });
      });
      setTransaction(table);
    });
    return () => unsubscribe();
  }, [formatted, uid]);

  // Regrouper les transactions par type
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

  // Calculer le total des dépenses ou revenus
  const CalculeTotal = (data) => {
    if (!data || data.length === 0) return 0;
    return data.reduce((acc, element) => {
      return acc + (element.Montant || 0);
    }, 0);
  };

  const Depense = CalculeTotal(TypeTrans.Dépense);
  const Revenu = CalculeTotal(TypeTrans.Revenu);
  const SoldeActuelle = Revenu - Depense;
  const TauxEparge =
    Revenu > 0 ? Math.round((SoldeActuelle / Revenu) * 100) : 0;

  // Données pour l'affichage
  const Statique = [
    {
      name: "Total",
      solde:
        SoldeActuelle >= 0
          ? `+ ${SoldeActuelle.toFixed(2)} Fr`
          : `- ${Math.abs(SoldeActuelle).toFixed(2)} Fr`,
      text: "Ce mois",
      icon: <Database />,
    },
    {
      name: "Revenus",
      solde: Revenu > 0 ? `+ ${Revenu.toFixed(2)} Fr` : "Aucun revenu",
      text: "+12% vs mois dernier",
      icon: <ArrowUp />,
    },
    {
      name: "Dépenses",
      solde: Depense > 0 ? `- ${Depense.toFixed(2)} Fr` : "Aucune dépense",
      text: "-8% vs mois dernier",
      icon: <ArrowDown />,
    },
    {
      name: "Solde net",
      solde:
        SoldeActuelle >= 0
          ? `+ ${SoldeActuelle.toFixed(2)} Fr`
          : `- ${Math.abs(SoldeActuelle).toFixed(2)} Fr`,
      text: "Différence mensuelle",
      icon: <Wallet />,
    },
  ];

  return (
    <div className="flex gap-4 items-center ">
      {Statique.map((items, index) => (
        <div
          key={index}
          className="bg-white flex flex-col gap-4 w-full md:w-1/4 rounded-3xl p-6 border-2 border-gray-100 shadow-sm"
        >
          <div className="text-xl flex items-center justify-between">
            <span className="font-semibold text-gray-500">{items.name}</span>
            <span
              className={`${
                index === 1
                  ? "text-green-500"
                  : index === 2
                  ? "text-red-500"
                  : "text-blue-500"
              }`}
            >
              {items.icon}
            </span>
          </div>
          <span
            className={`text-3xl font-bold ${
              index === 1 || (index === 3 && SoldeActuelle >= 0)
                ? "text-green-500"
                : index === 2 || (index === 3 && SoldeActuelle < 0)
                ? "text-red-500"
                : "text-blue-500"
            }`}
          >
            {items.solde}
          </span>
          <span className="text-lg font-light text-gray-400">{items.text}</span>
        </div>
      ))}
    </div>
  );
}

export default Vue_Transactions;
