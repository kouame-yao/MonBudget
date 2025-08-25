import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../database/firebase/auth";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../Auth/Authentification";

export default function CategoryPieChart() {
  const { user, connectGoogle, logout } = useAuth();
  const [transactions, setTransaction] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Récupération de la date du mois actuel (ex : "août 2025")
  const date = new Date();
  const options = { year: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("fr-FR", options);

  // Vérifier si on est côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Ne pas exécuter côté serveur
    if ((!isClient, !user?.uid)) return;

    const colRef = collection(db, "users", user?.uid, "transactions");

    // Écoute en temps réel de Firestore
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const table = [];
      querySnapshot.forEach((doc) => {
        table.push({ id: doc.id, ...doc.data() });
      });
      setTransaction(table);
    });

    return () => unsubscribe();
  }, [formatted, isClient, user?.uid]);

  // Ne rien afficher côté serveur
  if (!isClient) {
    return (
      <div className="bg-white shadow rounded-2xl p-4 w-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="flex items-center">
            <div className="w-1/2 h-64 bg-gray-200 rounded"></div>
            <div className="ml-4 flex-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /** Regroupe les transactions par type (Revenu / Dépense) */
  const groupByType = (data) => {
    const compte = {};
    for (let doc of data) {
      if (!compte[doc.Type]) {
        compte[doc.Type] = [];
      }
      compte[doc.Type].push(doc);
    }
    return compte;
  };

  const TypeTrans = groupByType(transactions);

  /** Fonction pour transformer les dépenses par catégorie */
  const transformCategoriesData = (depenses) => {
    const categories = {};

    depenses?.forEach((transaction) => {
      const categorie = transaction.Categorie;
      if (!categories[categorie]) {
        categories[categorie] = { name: categorie, value: 0 };
      }
      // Convertir en nombre si c'est une string
      const montant =
        typeof transaction.Montant === "string"
          ? parseFloat(transaction.Montant)
          : transaction.Montant;
      categories[categorie].value += montant;
    });

    // Convertir en tableau et ajouter des couleurs
    const colors = [
      "#ef4444", // Rouge
      "#f59e0b", // Orange
      "#8b5cf6", // Violet
      "#ec4899", // Rose
      "#06b6d4", // Cyan
      "#22c55e", // Vert
      "#f97316", // Orange foncé
      "#6366f1", // Indigo
      "#84cc16", // Lime
      "#e11d48", // Rose foncé
    ];

    const data = Object.values(categories).map((cat, index) => ({
      ...cat,
      color: colors[index % colors.length],
    }));

    // Trier par valeur décroissante pour un meilleur affichage
    return data.sort((a, b) => b.value - a.value);
  };

  // Générer les données du graphique
  const chartData = transformCategoriesData(TypeTrans?.Dépense);

  return (
    <div className="bg-white shadow rounded-2xl p-4 w-full">
      <h2 className="text-3xl font-semibold">Répartition par catégorie</h2>
      <p className="text-2xl text-gray-500 mb-4">
        Vos dépenses ce mois par catégorie
      </p>

      {chartData.length > 0 ? (
        <div className="flex items-center">
          <ResponsiveContainer width="50%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}€`, "Montant"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="ml-4">
            {chartData.map((item, i) => (
              <div key={i} className="flex justify-between gap-10 text-sm mb-1">
                <span className="flex items-center gap-4 text-3xl">
                  <span
                    className="w-5 h-5 rounded-full mr-2"
                    style={{ background: item.color }}
                  ></span>
                  {item.name}
                </span>
                <span className="font-medium text-3xl">{item.value}€</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p className="text-xl">Aucune dépense disponible pour ce mois</p>
        </div>
      )}
    </div>
  );
}
