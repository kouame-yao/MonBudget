import { Plus } from "lucide-react";
import { useState } from "react";
import Ajout_rapide from "../../components/dashboard/ajout/Ajout_rapide";
import Vue_Transactions from "../../components/transactions/ensemble_vue/Vue_Transactions";
import Recherche_transaction from "../../components/transactions/rechercheTransaction/Recherche_transaction";
import Wrapper from "../../layout/Wrapper";

function transactions() {
  const [modal, setModal] = useState(false);
  return (
    <Wrapper>
      <main className="flex flex-col gap-10">
        <section className="flex  justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-sm font-light  text-gray-700">
              Gérez et consultez l'historique de vos transactions
            </p>
          </div>
          <div
            onClick={() => setModal(!false)}
            className="md:text-base text-sm  md:p-2 px-3 cursor-pointer text-white flex items-center gap-2 rounded-lg bg-blue-500"
          >
            <Plus size={16} /> Nouvelle transaction
          </div>
        </section>

        <section className="flex flex-col gap-6 md:gap-10 px-4 md:px-12">
          <Vue_Transactions />
          <Recherche_transaction />
        </section>

        {modal && (
          <section className="fixed inset-0 grid place-items-center bg-black/50 z-50 px-4 ">
            <div className="w-full max-w-2xl bg-white py-4 px-2 md:p-8 rounded-2xl md:w-120 ">
              <span
                onClick={() => setModal(false)}
                className="place-items-end grid px-6 text-lg cursor-pointer md:mb-4"
              >
                x
              </span>
              <Ajout_rapide />
              <div className="px-6 md:p-0">
                <button
                  onClick={() => setModal(false)}
                  className="border-2 md:border-4 place-items-center hover:bg-gray-200 hover:shadow-lg border-gray-200 text-sm md:text-lg p-2 md:p-4 w-full mt-4 md:mt-4 rounded-2xl cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </Wrapper>
  );
}

export default transactions;
