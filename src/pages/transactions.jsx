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
        <section className="flex justify-between items-center">
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl font-bold">Transactions</h1>
            <p className="text-3xl font-light text-gray-700">
              Gérez et consultez l'historique de vos transactions
            </p>
          </div>
          <div
            onClick={() => setModal(!false)}
            className="text-3xl p-5 px-6 cursor-pointer text-white flex items-center gap-4 rounded-lg bg-blue-500"
          >
            <Plus /> Nouvelle transaction
          </div>
        </section>
        <section className="flex flex-col gap-10">
          <Vue_Transactions />
          <Recherche_transaction />
        </section>
        {modal && (
          <section className=" fixed top-0 left-0  grid justify-center h-screen items-center w-full bg-black/50 ">
            <div className="w-160 bg-white p-8 rounded-2xl ">
              <Ajout_rapide />
              <button
                onClick={() => {
                  setModal(false);
                }}
                className="border-4 hover:bg-gray-200 hover:shadow-lg border-gray-200 text-3xl p-4 w-full place-items-center mt-8 rounded-2xl cursor-pointer"
              >
                Annuler
              </button>
            </div>
          </section>
        )}
      </main>
    </Wrapper>
  );
}

export default transactions;
