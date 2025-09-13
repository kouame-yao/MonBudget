import { BadgeEuro } from "lucide-react";

function Parametres_Budget({ formatConfigue, handleConfigue }) {
  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg w-full p-8 flex flex-col gap-8 ">
      <div className="flex gap-4 items-center ">
        <span className="bg-green-200 text-green-500 w-12 h-12 rounded-2xl grid items-center justify-center">
          <BadgeEuro />
        </span>
        <div className="flex flex-col">
          <span className="text-lg font-semibold">Paramètres budget</span>
          <span className="text-sm font-light text-gray-500">
            Configurez vos limites et objectifs
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 items-center  gap-4">
        <label htmlFor="">
          <span className="text-sm text-gray-500">Limite mensuelle</span>
          <div className="flex items-center justify-end">
            <span className="absolute mr-4 text-sm text-gray-500">€</span>
            <input
              onChange={handleConfigue}
              value={formatConfigue?.limite ?? ""}
              name="limite"
              type="number"
              className="border-2 relative outline-none p-1 rounded-lg border-gray-200 w-full px-8"
            />
          </div>
        </label>
        <label htmlFor="">
          <span className="text-sm text-gray-500">Objectif d'épargne</span>
          <div className="flex items-center justify-end">
            <span className="absolute mr-4 text-sm text-gray-500">€</span>
            <input
              onChange={handleConfigue}
              value={formatConfigue?.objectif ?? ""}
              name="objectif"
              type="number"
              className="border-2 relative outline-none p-1 rounded-lg border-gray-200 w-full px-8"
            />
          </div>
        </label>
        <label htmlFor="">
          <span className="text-sm text-gray-500">Seuil d'alerte</span>
          <div className="flex items-center justify-end">
            <span className="absolute mr-4 text-sm text-gray-500">€</span>
            <input
              onChange={handleConfigue}
              value={formatConfigue?.alerte ?? ""}
              name="alerte"
              type="number"
              className="border-2 relative outline-none p-1 rounded-lg border-gray-200 w-full px-8"
            />
          </div>
        </label>
      </div>
    </div>
  );
}

export default Parametres_Budget;
