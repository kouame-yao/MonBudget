import {
  BarChart3,
  ChevronRight,
  PiggyBank,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../Auth/Authentification";

function Acceuil() {
  const { connectGoogle } = useAuth();
  return (
    <div>
      <section className="relative overflow-hidden pt-16 pb-16">
        {/* Background avec image floue style workspace */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-transparent"></div>
          {/* Simulation de l'arrière-plan flou avec des éléments */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-40 w-24 h-24 bg-orange-200/40 rounded-full blur-2xl"></div>
          <div className="absolute top-40 right-60 w-16 h-16 bg-amber-200/30 rounded-full blur-xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            {/* Contenu textuel à gauche */}
            <div className="space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                <ChevronRight className="w-3 h-3 text-blue-600 mr-1" />
                Nouvelle version disponible
              </div>

              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Maîtrisez vos <span className="text-blue-600">finances</span>
                  <br />
                  comme un pro
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  L'application de gestion budgétaire nouvelle génération.
                  Suivez, analysez et optimisez vos finances personnelles avec
                  des outils intelligents et une interface moderne.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => connectGoogle()}
                  className="bg-blue-600 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg"
                >
                  📊 Démarrer gratuitement
                </button>
                <button
                  onClick={() => connectGoogle()}
                  className="border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center justify-center bg-white/80 backdrop-blur-sm"
                >
                  👁️ Voir la démo
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row gap-6 text-sm">
                <div className="flex items-center text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Gratuit pendant 30 jours
                </div>
                <div className="flex items-center text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  100% sécurisé
                </div>
                <div className="flex items-center text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Configuration en 2 min
                </div>
              </div>
            </div>

            {/* Laptop mockup à droite */}
            <div className="relative">
              {/* Effet de profondeur et lumière */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-2xl"></div>

              {/* Laptop en perspective */}
              <div className="relative transform perspective-1000 rotate-y-12 hover:rotate-y-6 transition-transform duration-700">
                <div className="bg-gray-800 rounded-t-2xl p-1">
                  <div className="bg-gray-900 rounded-t-2xl p-4 pb-0">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>

                    {/* Écran avec interface */}
                    <div className="bg-white rounded-t-lg overflow-hidden shadow-2xl">
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-6 h-80">
                        {/* Header de l'app */}
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center space-x-2">
                            <PiggyBank className="h-6 w-6 text-blue-600" />
                            <span className="font-bold text-gray-900">
                              MonBudget
                            </span>
                          </div>
                          <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            Dashboard
                          </div>
                        </div>

                        {/* Cards avec données */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl">
                            <div className="text-lg font-bold text-green-700">
                              +2,450€
                            </div>
                            <div className="text-xs text-green-600">
                              Revenus
                            </div>
                          </div>
                          <div className="bg-gradient-to-br from-red-100 to-rose-100 p-4 rounded-xl">
                            <div className="text-lg font-bold text-red-700">
                              -1,890€
                            </div>
                            <div className="text-xs text-red-600">Dépenses</div>
                          </div>
                        </div>

                        {/* Graphique simplifié */}
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                          <div className="h-16 bg-gradient-to-r from-blue-200 via-purple-200 to-indigo-200 rounded opacity-80 relative overflow-hidden">
                            <div className="absolute bottom-0 left-1/4 w-1 h-8 bg-blue-500"></div>
                            <div className="absolute bottom-0 left-2/4 w-1 h-12 bg-green-500"></div>
                            <div className="absolute bottom-0 left-3/4 w-1 h-6 bg-purple-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Base du laptop */}
                <div className="bg-gray-800 h-4 rounded-b-2xl shadow-lg"></div>
              </div>

              {/* Éléments décoratifs flous */}
              <div className="absolute top-10 -right-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-5 right-20 w-16 h-16 bg-orange-200/30 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour gérer votre budget
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des outils puissants et intuitifs pour prendre le contrôle de vos
              finances personnelles
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Suivi en temps réel
              </h3>
              <p className="text-gray-600">
                Ajoutez vos dépenses et revenus instantanément. Visualisez votre
                solde en temps réel avec une interface intuitive.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Analyses détaillées
              </h3>
              <p className="text-gray-600">
                Analysez vos habitudes de consommation avec des graphiques
                interactifs et des rapports mensuels et annuels.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Interface moderne
              </h3>
              <p className="text-gray-600">
                Une expérience utilisateur exceptionnelle sur mobile et desktop.
                Design responsive et intuitif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            Rejoignez des milliers d'utilisateurs satisfaits
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-200">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">€2.5M</div>
              <div className="text-blue-200">Budget géré</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.8/5</div>
              <div className="text-blue-200">Note moyenne</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">99%</div>
              <div className="text-blue-200">Disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Prêt à transformer votre gestion financière ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Commencez dès aujourd'hui et découvrez comment MonBudget peut vous
            aider à atteindre vos objectifs financiers.
          </p>
          <button
            onClick={() => connectGoogle()}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Créer mon compte gratuitement
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <PiggyBank className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">MonBudget</span>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="hover:text-blue-400 transition-colors">
                À propos
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Confidentialité
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            © 2024 MonBudget. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Acceuil;
