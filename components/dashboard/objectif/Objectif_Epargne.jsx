import { Trophy } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "../../../Auth/Authentification";

export default function Objectif_Epargne() {
  const { Get_transactions = [], configue, devise = "Fr" } = useAuth();

  // supporte configue en tableau ou objet
  const cfg = Array.isArray(configue) ? configue[0] : configue || {};

  const { objectif, objectifValue } = useMemo(() => {
    const obj = Number(cfg?.Objectif_épargne ?? cfg?.objectif ?? 0) || 0;
    return { objectif: obj, objectifValue: obj };
  }, [cfg]);

  // Calcul de l'épargne courante (revenus - dépenses) sur toutes les transactions
  const currentSaved = useMemo(() => {
    if (!Array.isArray(Get_transactions) || Get_transactions.length === 0)
      return 0;
    let revenus = 0;
    let depenses = 0;
    Get_transactions.forEach((t) => {
      const montant = Number(t.Montant) || 0;
      if (t.Type === "Revenu") revenus += montant;
      else if (t.Type === "Dépense") depenses += montant;
    });
    return revenus - depenses;
  }, [Get_transactions]);

  const percent = useMemo(() => {
    if (!objectif || objectif <= 0) return 0;
    const p = Math.round((currentSaved / objectif) * 100);
    return Math.max(0, Math.min(100, p));
  }, [currentSaved, objectif]);

  const remaining = Math.max(0, Math.round((objectif || 0) - currentSaved));

  return (
    <div className="w-full max-w-sm md:max-w-md mx-auto ">
      <div className="bg-blue-500 text-white p-3 sm:p-4 md:p-5 shadow-md rounded-xl flex flex-col gap-3 sm:gap-4 md:gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-1 sm:gap-2 md:gap-3">
          <span className="text-lg sm:text-xl md:text-2xl font-semibold">
            Objectif d'épargne
          </span>
          <Trophy size={28} className="sm:w-8 sm:h-8 md:w-10 md:h-10" />
        </div>

        <div className="flex flex-col gap-1 sm:gap-2">
          <div className="flex items-center justify-between text-sm sm:text-base md:text-lg font-light">
            {objectif > 0 ? (
              <>
                <span>
                  {currentSaved} {devise} / {objectif} {devise}
                </span>
                <span>{percent}%</span>
              </>
            ) : (
              <span>Aucun objectif défini</span>
            )}
          </div>

          <div className="w-full h-2 sm:h-3 md:h-3 bg-white/50 rounded-full">
            <div
              className="h-2 sm:h-3 md:h-3 bg-white rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <div>
          {objectif > 0 ? (
            <span className="text-sm sm:text-base md:text-lg font-light block">
              {remaining > 0
                ? `Plus que ${remaining} ${devise} pour atteindre votre objectif !`
                : `Objectif atteint 🎉`}
            </span>
          ) : (
            <span className="text-sm sm:text-base md:text-lg font-light block">
              Définissez un objectif d'épargne dans les paramètres.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
