import Ajout_rapide from "../../components/dashboard/ajout/Ajout_rapide";
import Objectif_Epargne from "../../components/dashboard/objectif/Objectif_Epargne";
import Statistiques_rapides from "../../components/dashboard/statistiques/Statistiques_rapides";
import Transactions_recentes from "../../components/dashboard/transactions/Transactions_recentes";
import Donne_mensuelle from "../../components/dashboard/Vue_Mensuelle/Donne_mensuelle";
import Wrapper from "../../layout/Wrapper";

function Dashboard() {
  return (
    <Wrapper>
      <main className="w-full flex flex-col gap-8 md:gap-10 mb-20 px-4 sm:px-6 md:px-10">
        {/* Titre */}
        <section className="flex flex-col space-y-2 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Tableau de bord
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-light text-gray-500">
            Gérez vos finances personnelles en toute simplicité
          </p>
        </section>

        {/* Contenu principal */}
        <section className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Colonne principale */}
          <div className="flex flex-col gap-6 lg:gap-10 w-full lg:w-2/3">
            <Donne_mensuelle />
            <Transactions_recentes />
          </div>

          {/* Colonne secondaire */}
          <div className="flex flex-col gap-6 lg:gap-10 w-full lg:w-1/3">
            <Ajout_rapide />
            <Statistiques_rapides />
            <Objectif_Epargne />
          </div>
        </section>
      </main>
    </Wrapper>
  );
}

export default Dashboard;
