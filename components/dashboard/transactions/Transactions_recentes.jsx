import { collection, onSnapshot } from "firebase/firestore";
import {
  ArrowRight,
  BadgeDollarSign,
  Car,
  Gamepad2,
  HeartPulse,
  Home,
  Landmark,
  MoreHorizontal,
  PiggyBank,
  ShoppingBag,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { db } from "../../../database/firebase/auth";
import { useAuth } from "../../../Auth/Authentification";

export default function Transactions_recentes() {
  const { user, connectGoogle, logout, loading } = useAuth();
  const uid = user?.uid;
  const router = useRouter();
  const [transactions, setTransaction] = useState([]);
  const categoriesWithIcons = [
    {
      text: "Alimentation",
      value: "Alimentation",
      icon: <Utensils size={20} />,
      color: "#3b82f6", // Bleu (couleur souvent associée à la nourriture)
    },
    {
      text: "Transport",
      value: "Transport",
      icon: <Car size={20} />,
      color: "#10b981", // Vert (couleur souvent associée au transport écologique)
    },
    {
      text: "Logement",
      value: "Logement",
      icon: <Home size={20} />,
      color: "#ef4444", // Rouge (couleur pour les dépenses importantes comme le logement)
    },
    {
      text: "Loisirs",
      value: "Loisirs",
      icon: <Gamepad2 size={20} />,
      color: "#8b5cf6", // Violet (couleur ludique pour les loisirs)
    },
    {
      text: "Santé",
      value: "Santé",
      icon: <HeartPulse size={20} />,
      color: "#ec4899", // Rose (couleur souvent associée à la santé et au bien-être)
    },
    {
      text: "Shopping",
      value: "Shopping",
      icon: <ShoppingBag size={20} />,
      color: "#f59e0b", // Orange (couleur dynamique pour le shopping)
    },
    {
      text: "Salaire",
      value: "Salaire",
      icon: <Landmark size={20} />,
      color: "#22c55e", // Vert (couleur souvent associée à l'argent et aux revenus)
    },
    {
      text: "Epargne",
      value: "Epargne",
      icon: <PiggyBank size={20} />,
      color: "#6b7280", // Gris (couleur neutre pour l'épargne)
    },
    {
      text: "Investissement",
      value: "Investissement",
      icon: <TrendingUp size={20} />,
      color: "#06b6d4", // Cyan (couleur souvent associée à la croissance et aux investissements)
    },
    {
      text: "Autres",
      value: "Autres",
      icon: <MoreHorizontal size={20} />,
      color: "#64748b", // Gris-bleu (couleur neutre pour les catégories diverses)
    },
  ];

  const date = new Date(); // par exemple : 2025-08-24
  const options = { year: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("fr-FR", options);
  useEffect(() => {
    if (loading) {
      return;
    }
    const colRef = collection(db, "users", uid, "transactions");

    // écoute en temps réel
    const unsubscribe = onSnapshot(colRef, (querySnapshot) => {
      const table = [];
      querySnapshot.forEach((doc) => {
        table.push({ id: doc.id, ...doc.data() });
      });
      setTransaction(table);
    });

    // nettoyage à la désactivation du composant
    return () => unsubscribe();
  }, [formatted, uid]);

  return (
    <div>
      <div className="bg-white flex flex-col gap-8 border-4 w-full border-gray-200 shadow-md rounded-3xl p-10">
        <div className="flex justify-between items-baseline">
          <h1 className="text-4xl font-bold">Transactions récentes</h1>
          <p
            onClick={() => {
              router.push("transactions");
            }}
            className="text-2xl cursor-pointer font-semibold text-blue-500"
          >
            Voir tout
          </p>
        </div>

        <div className="flex flex-col gap-4 border-b-4 border-gray-200">
          {transactions?.slice(0, 6)?.map((items, index) => {
            // Trouve l'icône et la couleur associées à la catégorie
            const categoryInfo = categoriesWithIcons.find(
              (category) => category.value === items.Categorie
            ) || {
              icon: <BadgeDollarSign size={24} />,
              color: "#9ca3af", // Couleur par défaut (gris)
            };

            return (
              <div
                key={index}
                className="hover:bg-gray-100 cursor-pointer rounded-2xl px-4 md:px-12 py-6 md:py-8 flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  {/* Utilise l'icône et la couleur de la catégorie */}
                  <span
                    className="w-12 h-12 rounded-2xl grid justify-center items-center"
                    style={{ backgroundColor: `${categoryInfo.color}40` }}
                  >
                    {React.cloneElement(categoryInfo.icon, {
                      color: categoryInfo.color,
                      size: 24,
                    })}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-lg md:text-2xl font-semibold">
                      {items.Description}
                    </span>
                    <span className="text-sm md:text-xl font-light text-gray-500">
                      {items.Categorie} •{" "}
                      {items.Date_at?.toDate
                        ? items.Date_at.toDate().toLocaleDateString("fr-FR", {
                            month: "long",
                            day: "numeric",
                          })
                        : "Date inconnue"}
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xl md:text-3xl ${
                    items.Type === "Dépense" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {items.Type === "Dépense" ? "-" : "+"} {items.Montant} Fr
                </span>
              </div>
            );
          })}
        </div>

        <div className="cursor-pointer text-blue-700 place-items-center text-2xl grid justify-center">
          <span
            onClick={() => {
              router.push("transactions");
            }}
            className="cursor-pointer flex items-center gap-4"
          >
            Voir toutes les transactions <ArrowRight />
          </span>
        </div>
      </div>
    </div>
  );
}
