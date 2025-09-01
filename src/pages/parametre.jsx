import React from "react";
import Wrapper from "../../layout/Wrapper";
import Profil_Utilisateur from "../../components/parametres/Profil_Utilisateur";
import Parametres_Budget from "../../components/parametres/Parametres_Budget";
import { Disc, DiscAlbum } from "lucide-react";

export default function parametre() {
  return (
    <Wrapper>
      <main className="flex flex-col gap-8 md:w-240 mb-10">
        <section className="flex flex-col gap-1">
          <span className="text-2xl font-bold">Paramètres</span>
          <span className="text-gray-500 text-sm">
            Personnalisez votre expérience MonBudget
          </span>
        </section>
        <section className="flex flex-col gap-8">
          <Profil_Utilisateur />
          <Parametres_Budget />
        </section>
        <section>
          <div className="flex gap-4 items-center justify-end">
            <button className="border-2 cursor-pointer border-gray-200 hover:bg-gray-400 text-black p-2 rounded-lg">
              Annuler
            </button>
            <button className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white p-2 rounded-lg flex items-center gap-2">
              <Disc /> Sauvegarder{" "}
            </button>
          </div>
        </section>
      </main>
    </Wrapper>
  );
}
