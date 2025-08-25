import Ajout_rapide from "../../components/dashboard/ajout/Ajout_rapide";
import Objectif_Epargne from "../../components/dashboard/objectif/Objectif_Epargne";
import Statistiques_rapides from "../../components/dashboard/statistiques/Statistiques_rapides";
import Transactions_recentes from "../../components/dashboard/transactions/Transactions_recentes";
import Donne_mensuelle from "../../components/dashboard/Vue_Mensuelle/Donne_mensuelle";
import Wrapper from "../../layout/Wrapper";

function dashboard() {
  return (
    <Wrapper>
      <main className="w-full flex flex-col gap-10 mb-20">
        <section>
          <div className="flex flex-col space-y-4">
            <h1 className="text-6xl font-bold">Tableau de bord</h1>
            <p className="text-2xl font-light text-gray-500 ">
              Gérez vos finances personnelles en toute simplicité
            </p>
          </div>
        </section>
        <section className="flex w- gap-10">
          <div className="flex flex-col gap-20 w-full">
            <Donne_mensuelle />
            <Transactions_recentes />
          </div>
          <div className="w-250 flex flex-col gap-10">
            <Ajout_rapide />
            <Statistiques_rapides />
            <Objectif_Epargne />
          </div>
        </section>
      </main>
    </Wrapper>
  );
}

export default dashboard;
