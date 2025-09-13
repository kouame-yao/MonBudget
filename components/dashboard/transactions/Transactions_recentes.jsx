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
  const { Get_transactions,devise } = useAuth();

  const router = useRouter();

  const categoriesWithIcons = [
    {
      text: "Alimentation",
      value: "Alimentation",
      icon: <Utensils />,
      color: "#3b82f6",
    },
    { text: "Transport", value: "Transport", icon: <Car />, color: "#10b981" },
    { text: "Logement", value: "Logement", icon: <Home />, color: "#ef4444" },
    { text: "Loisirs", value: "Loisirs", icon: <Gamepad2 />, color: "#8b5cf6" },
    { text: "Santé", value: "Santé", icon: <HeartPulse />, color: "#ec4899" },
    {
      text: "Shopping",
      value: "Shopping",
      icon: <ShoppingBag />,
      color: "#f59e0b",
    },
    { text: "Salaire", value: "Salaire", icon: <Landmark />, color: "#22c55e" },
    {
      text: "Epargne",
      value: "Epargne",
      icon: <PiggyBank />,
      color: "#6b7280",
    },
    {
      text: "Investissement",
      value: "Investissement",
      icon: <TrendingUp />,
      color: "#06b6d4",
    },
    {
      text: "Autres",
      value: "Autres",
      icon: <MoreHorizontal />,
      color: "#64748b",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-4 sm:p-6 md:p-8 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Transactions récentes
        </h2>
        <p
          onClick={() => router.push("transactions")}
          className="text-sm sm:text-base md:text-lg font-semibold text-blue-500 cursor-pointer"
        >
          Voir tout
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 border-b border-gray-200 pb-2 sm:pb-3 md:pb-4">
        {Get_transactions?.slice(0, 6)?.map((items, index) => {
          const categoryInfo = categoriesWithIcons.find(
            (cat) => cat.value === items.Categorie
          ) || {
            icon: <BadgeDollarSign />,
            color: "#9ca3af",
          };

          return (
            <div
              key={index}
              className="flex justify-between items-center px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-xl hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <span
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${categoryInfo.color}40` }}
                >
                  {React.cloneElement(categoryInfo.icon, {
                    color: categoryInfo.color,
                    size: 18,
                  })}
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm sm:text-base md:text-lg font-semibold">
                    {items.Description}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base text-gray-500 font-light">
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
                className={`text-sm sm:text-base md:text-lg font-semibold ${
                  items.Type === "Dépense" ? "text-red-500" : "text-green-500"
                }`}
              >
                {items.Type === "Dépense" ? "-" : "+"} {items.Montant} {devise}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-2 sm:mt-3 md:mt-4 flex justify-center text-blue-700 text-sm sm:text-base md:text-lg font-medium cursor-pointer">
        <span
          className="flex items-center gap-2"
          onClick={() => router.push("transactions")}
        >
          Voir toutes les transactions <ArrowRight size={16} />
        </span>
      </div>
    </div>
  );
}
