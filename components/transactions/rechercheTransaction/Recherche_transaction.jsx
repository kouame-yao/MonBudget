import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowDown,
  ArrowUp,
  BadgeDollarSign,
  Car,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Gamepad2,
  HeartPulse,
  Home,
  Landmark,
  MoreHorizontal,
  Pen,
  PiggyBank,
  RefreshCcw,
  Save,
  Search,
  ShoppingBag,
  Trash,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "../../../database/firebase/auth";
import React from "react";
import { useAuth } from "../../../Auth/Authentification";
function Recherche_transaction() {
  const { user, connectGoogle, logout, loading } = useAuth();
  const uid = user?.uid;
  const [transactions, setTransaction] = useState([]);
  const [element, setElement] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({
    periode: null,
    Type: null,
  });
  const [InputSelectFilter, setInputSelectFilter] = useState({
    input: "",
    select: "",
  });
  const [togglebtn, setTogglebtn] = useState("Dépense");
  const [loadings, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    montant: "",
    description: "",
    categorie: "",
    Date: "",
  });
  const [active, setActive] = useState(false);
  const [idItems, setIdItems] = useState(null);
  const today = new Date();
  const mois = today.getMonth() + 1;
  const trimestre = Math.ceil(mois / 3);
  const annee = today.getFullYear();

  const periode = [
    { text: "Ce mois", value: mois },
    { text: "Ce trimestre", value: trimestre },
    { text: "Cette année", value: annee },
    { text: "Tout", value: "" },
  ];

  const Type = [
    { text: "Tous les types", value: "" },
    { text: "Revenus uniquement", value: "Revenu" },
    { text: "Dépenses uniquement", value: "Dépense" },
  ];

  const Categories = [
    { text: "Toutes les catégories", value: "" },
    { text: "Alimentation", value: "Alimentation" },
    { text: "Transport", value: "Transport" },
    { text: "Logement", value: "Logement" },
    { text: "Loisirs", value: "Loisirs" },
    { text: "Santé", value: "Santé" },
    { text: "Shopping", value: "Shopping" },
    { text: "Salaire", value: "Salaire" },
    { text: "Epargne", value: "Epargne" },
    { text: "Inverstissement", value: "Inverstissement" },
    { text: "Autres", value: "Autres" },
  ];

  const CategoriModale = {
    Dépense: [
      { text: "Alimentation" },
      { text: "Transport" },
      { text: "Logement" },
      { text: "Loisirs" },
      { text: "Santé" },
      { text: "Shopping" },
      { text: "Autres" },
    ],
    Revenu: [
      { text: "Salaire" },
      { text: "Inverstissement" },
      { text: "Cardeaux" },
      { text: "Autres" },
    ],
  };
  const btn = [
    { name: "Dépense", icon: <ArrowDown />, color: "text-red-500" },
    { name: "Revenu", icon: <ArrowUp />, color: "text-green-500" },
  ];

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
    if (loading) return;
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

  // filtrage
  const transactionFilter = transactions
    ?.filter((t) => {
      const d = new Date(t.Date_at.seconds * 1000);
      const mois = d.getMonth() + 1;
      const trimestre = Math.ceil(mois / 3);
      const annee = d.getFullYear();

      const matchPeriode =
        !filter.periode ||
        filter.periode.toString() === mois.toString() ||
        filter.periode.toString() === trimestre.toString() ||
        filter.periode.toString() === annee.toString();

      const matchType =
        !filter.Type || filter.Type.toString() === t.Type.toString();
      const matchCategorie =
        !InputSelectFilter.select ||
        InputSelectFilter.select.toString() === t.Categorie.toString();
      return matchPeriode && matchType && matchCategorie;
    })
    .filter((doc) => {
      const seactText = InputSelectFilter.input.toLowerCase();
      const field = [doc.Categorie, doc.Type, doc.Description];
      return field.some((t) => t.toLowerCase().includes(seactText));
    });

  // Paginations
  const itemsPerPage = 7;
  const totalPage = Math.ceil(transactionFilter.length / itemsPerPage);
  const starIndex = (currentPage - 1) * itemsPerPage;
  const StartItems = transactionFilter.slice(
    starIndex,
    starIndex + itemsPerPage
  );

  const ToggglePage = (page) => {
    if (page < 1 || page > totalPage) return;
    setCurrentPage(page);
  };
  const handChange = (field, value) => {
    setFilter((prev) => ({
      ...prev,
      [field]: prev[field] === value ? null : value,
    }));
  };
  const handlechangeInputSelect = (e) => {
    const { name, value } = e.target;
    setInputSelectFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };
  const renitialisation = () => {
    setFilter({
      periode: null,
      Type: null,
    });
    setInputSelectFilter({
      input: "",
      select: "",
    });
  };

  const itemsModifie = (id) => {
    const element = StartItems?.find((t) => t.id === id);
    const dateObj = element.Date_at
      ? new Date(element.Date_at.seconds * 1000)
      : null;
    setInputValue({
      description: element.Description,
      montant: element.Montant,
      categorie: element.Categorie?.trim() || "",
      Date: dateObj ? dateObj.toISOString().substring(0, 10) : "",
    });
    console.log(element);
  };

  const editeElement = async () => {
    const dateStr = inputValue.Date; // "2025-08-25"
    const newDate = new Date(dateStr); // UTC 00:00:00
    const timestamp = Timestamp.fromDate(newDate);
    setLoading(true);
    if (
      !togglebtn ||
      !inputValue.montant ||
      !inputValue.description ||
      !inputValue.categorie
    ) {
      setLoading(false);
      console.log("Veillez remplir tout les champs");
      return;
    }
    try {
      const washingtonRef = doc(db, "users", uid, "transactions", idItems);

      // Set the "capital" field of the city 'DC'
      await updateDoc(washingtonRef, {
        Montant: inputValue.montant,
        Description: inputValue.description,
        Categorie: inputValue.categorie,
        Type: togglebtn,
        Date_at: timestamp,
      });
      setLoading(false);
      console.log("update reussi");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   editeElement();
  // }, []);

  const supprimerDonner = async (id) => {
    try {
      const washingtonRef = doc(db, "users", uid, "transactions", id);

      await deleteDoc(washingtonRef);
      console.log("Element a l:id:", idItems);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main>
      <div className="flex gap-4 mb-20">
        <section
          className="w-164 flex
       flex-col gap-8"
        >
          <div className="bg-white flex flex-col gap-4 p-10 rounded-3xl border-4 border-gray-200 shadow-md">
            <h1 className="text-4xl font-bold">Recherche</h1>
            <div className="flex items-center w-full ">
              <input
                name="input"
                value={InputSelectFilter.input}
                onChange={handlechangeInputSelect}
                placeholder="Recherche une transaction..."
                type="text"
                className="px-15 outline-none placeholder:text-gray-400 relative p-4 w-full placeholder: rounded-lg border-4 border-gray-200 text-2xl  "
              />
              <span className="absolute px-5  text-gray-400  ">
                <Search size={30} />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white p-10 rounded-3xl border-4 border-gray-200 shadow-md text-left">
            <div className="text-3xl font-bold">Période</div>
            {periode.map((items, index) => {
              return (
                <div key={index} className="flex items-center gap-8">
                  <input
                    checked={filter.periode === items.value}
                    onChange={() => {
                      handChange("periode", items.value);
                    }}
                    type="radio"
                    className="scale-150"
                  />
                  <span className="text-2xl">{items.text}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 bg-white p-10 rounded-3xl border-4 border-gray-200 shadow-md text-left">
            <div className="text-3xl font-bold">Type</div>
            {Type.map((items, index) => {
              return (
                <div key={index} className="flex items-center gap-8">
                  <input
                    checked={filter.Type === items.value}
                    onChange={() => {
                      handChange("Type", items.value);
                    }}
                    type="radio"
                    className="scale-150"
                  />
                  <span className="text-2xl">{items.text}</span>
                </div>
              );
            })}
          </div>

          <div className="bg-white flex flex-col gap-4 p-10 rounded-3xl border-4 border-gray-200 shadow-md">
            <h1 className="text-4xl font-bold">Catégories</h1>
            <select
              value={InputSelectFilter.select}
              onChange={handlechangeInputSelect}
              className=" outline-none text-2xl border-4 border-gray-200 rounded-lg p-4 w-full"
              name="select"
              id=""
            >
              {Categories.map((items, index) => {
                return (
                  <option key={index} value={items.value}>
                    {items.text}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <button
              onClick={renitialisation}
              className="cursor-pointer hover:text-white place-items-center justify-center font-semibold hover:bg-gray-400 hover:scale-105 text-2xl pla flex gap-4 items-center bg-gray-200 text-gray-500 p-4 w-full rounded-2xl"
            >
              <RefreshCcw /> Rénitialiser les filtres
            </button>
          </div>
        </section>

        <section className="w-full">
          <div className="bg-white flex flex-col gap-8 border-4 w-full border-gray-200 shadow-md rounded-3xl ">
            <div className="flex justify-between items-center px-12 py-8">
              <h1 className="text-4xl font-bold">
                Historique des transactions
              </h1>
              <p className="text-2xl  text-gray-500">
                {transactionFilter?.length} transaction(s)
              </p>
            </div>
            <div className="flex flex-col border-b-4 border-gray-200">
              {StartItems?.map((items, index) => (
                <div key={index} className="grid items-center relative">
                  <div className="hover:bg-gray-300 cursor-pointer border-gray-200 border-t-4 px-4 md:px-12 py-6 md:py-8 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      {/* Utilisation de l'icône et de la couleur de la catégorie */}
                      {(() => {
                        const categoryInfo = categoriesWithIcons.find(
                          (category) => category.value === items.Categorie
                        ) || {
                          icon: <BadgeDollarSign size={24} />,
                          color: "#9ca3af",
                        };
                        return (
                          <span
                            className="w-12 h-12 rounded-2xl grid justify-center items-center"
                            style={{
                              backgroundColor: `${categoryInfo.color}40`,
                            }}
                          >
                            {React.cloneElement(categoryInfo.icon, {
                              color: categoryInfo.color,
                            })}
                          </span>
                        );
                      })()}
                      <div className="flex flex-col gap-1">
                        <span className="text-lg md:text-2xl font-semibold">
                          {items.Description}
                        </span>
                        <span className="text-sm md:text-xl font-light text-gray-500">
                          {items.Categorie} •{" "}
                          {items.Date_at?.toDate
                            ? items.Date_at.toDate().toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )
                            : "1 déc."}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xl md:text-3xl ${
                          items.Type === "Dépense"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {items.Type === "Dépense" ? "-" : "+"}
                        {items.Montant} Fr
                      </span>
                      <button
                        onClick={() => {
                          setElement(index);
                          setToggle(!toggle);
                        }}
                        className="cursor-pointer hover:bg-gray-400 w-10 h-10 rounded-md grid justify-center items-center"
                      >
                        <EllipsisVertical size={24} />
                      </button>
                    </div>
                  </div>
                  {element === index && toggle && (
                    <div className="bg-white absolute right-4 md:right-10 z-10 top-16 md:top-20 text-base md:text-2xl w-56 md:w-70 flex flex-col gap-2 rounded-2xl py-2 border-2 border-gray-200 shadow-lg">
                      <span
                        onClick={() => {
                          setActive(!active);
                          itemsModifie(items.id);
                          setIdItems(items.id);
                        }}
                        className="flex text-gray-500 font-light hover:bg-gray-200 py-2 px-2 cursor-pointer items-center gap-4"
                      >
                        <Pen size={18} color="gray" /> Modifier
                      </span>
                      <span
                        onClick={() => {
                          supprimerDonner(items.id);
                        }}
                        className="flex text-red-500 hover:bg-red-200 py-2 px-2 cursor-pointer items-center gap-4"
                      >
                        <Trash size={18} color="red" /> Supprimer
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center py-8 px-6">
              <div className="text-2xl text-gray-400">
                Page {currentPage} sur {totalPage}
              </div>
              <div className="flex items-center gap-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    ToggglePage(currentPage - 1);
                  }}
                  className="bg-gray-400 w-12 h-12 place-items-center rounded-2xl disabled:opacity-50 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
                >
                  <ChevronLeft />
                </button>
                {Array.from({ length: totalPage }, (_, i) => {
                  return (
                    <button
                      key={i + 1}
                      onClick={() => {
                        ToggglePage(i + 1);
                      }}
                      className={`${
                        currentPage === i + 1
                          ? "bg-blue-700 text-white"
                          : "bg-white"
                      } w-12 h-12 text-2xl rounded-2xl disabled:opacity-50 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage === totalPage}
                  onClick={() => {
                    ToggglePage(currentPage + 1);
                  }}
                  className="bg-gray-400 w-12 h-12 place-items-center rounded-2xl disabled:opacity-50 transition-all duration-300 ease-in-out hover:scale-105 cursor-pointer"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Modifie */}
      </div>

      {active && (
        <section className="fixed top-0 left-0 w-full h-screen bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-8 w-full max-w-2xl flex flex-col gap-8 shadow-md rounded-3xl border-4 border-gray-200 overflow-y-auto max-h-[90vh]">
            <span className="text-4xl font-semibold">Ajout rapide</span>
            <div className="bg-gray-300 cursor-pointer rounded-2xl p-2 w-full flex justify-between items-center gap-4 ">
              {btn.map((items, index) => {
                return (
                  <button
                    onClick={() => {
                      setTogglebtn(items.name);
                    }}
                    key={index}
                    className={`${items.color} ${
                      togglebtn === items.name ? "bg-white rounded-lg p-4" : ""
                    } text-2xl flex items-center gap-4 w-full justify-center cursor-pointer transition-all duration-300 hover:scale-100`}
                  >
                    {" "}
                    {items.icon} {items.name}{" "}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-4" htmlFor="">
                <span className="text-2xl">Montant</span>
                <input
                  value={inputValue.montant}
                  name="montant"
                  onChange={handleChange}
                  placeholder="0.00"
                  type="number"
                  className="border-4 placeholder:text-2xl text-2xl border-gray-300 p-5 w-full rounded-2xl outline-none focus:border-blue-300"
                />
              </label>
              <label className="flex flex-col gap-4" htmlFor="">
                <span className="text-2xl">Description</span>
                <input
                  value={inputValue.description}
                  name="description"
                  onChange={handleChange}
                  placeholder="Ex: Courses du matin"
                  type="text"
                  className="border-4 placeholder:text-2xl text-2xl border-gray-300 p-5 w-full rounded-2xl outline-none focus:border-blue-300"
                />
              </label>
              <label className="flex flex-col gap-4" htmlFor="">
                <span className="text-2xl">Catégorie</span>
                <select
                  value={inputValue.categorie}
                  onChange={handleChange}
                  className="border-4 placeholder:text-2xl text-2xl border-gray-300 p-5 w-full rounded-2xl outline-none focus:border-blue-300"
                  name="categorie"
                  id=""
                >
                  <option value="">Choisir la catégorie</option>;
                  {Categories?.map((items, index) => {
                    return (
                      <option key={index} value={items.text}>
                        {items.text}{" "}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label className="flex flex-col gap-4" htmlFor="">
                <span className="text-2xl">Date</span>
                <input
                  value={inputValue.Date}
                  name="Date"
                  onChange={handleChange}
                  placeholder="Ex: Courses du matin"
                  type="date"
                  className="border-4 placeholder:text-2xl  text-2xl border-gray-300 p-5 w-full rounded-2xl outline-none focus:border-blue-300"
                />
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setActive(false)}
                className="text-2xl p-4 cursor-pointer font-semibold rounded-2xl w-full grid justify-center border-4 border-gray-200  "
              >
                Annuler
              </button>
              <div
                onClick={editeElement}
                className={`w-full ${
                  togglebtn === "Dépense" ? "bg-red-500" : "bg-green-500"
                } text-white font-semibold grid justify-center items-center rounded-2xl p-5 cursor-pointer`}
              >
                <button className="text-2xl flex items-center gap-8 cursor-pointer">
                  {loadings ? (
                    <div className="flex items-center gap-4">
                      <div className=" animate-spin  rounded-full border-b-transparent border-4 p-4 border-violet-400 "></div>
                      <div>Chargement...</div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <Save size={30} />
                      Sauvegarder
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default Recherche_transaction;
