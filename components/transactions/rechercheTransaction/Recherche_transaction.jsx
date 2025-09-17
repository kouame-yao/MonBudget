import { Timestamp } from "firebase/firestore";
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
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../Auth/Authentification";
function Recherche_transaction() {
  const { Get_transactions, Edited_editeElement, supprimerDonner, devise } =
    useAuth();

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
  const divRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      // Si on clique en dehors de la div
      if (divRef.current && !divRef.current.contains(event.target)) {
        setToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    { text: "Factures", value: "Factures" },
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

  // filtrage
  const transactionFilter = Get_transactions?.filter((t) => {
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
  }).filter((doc) => {
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

  // Génère une liste compacte de numéros de page avec des '...' pour les grandes paginations
  const getPageNumbers = () => {
    const pages = [];
    const total = totalPage;
    const current = currentPage;
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Si proche du début
    if (current <= 4) {
      pages.push(1, 2, 3, 4, "...", total);
      return pages;
    }

    // Si proche de la fin
    if (current >= total - 3) {
      pages.push(1, "...", total - 3, total - 2, total - 1, total);
      return pages;
    }

    // Milieu
    pages.push(1, "...", current - 1, current, current + 1, "...", total);
    return pages;
  };

  const itemsModifie = (id) => {
    const element = StartItems?.find((t) => t.id === id);
    const dateObj = element.Date_at
      ? new Date(element.Date_at.seconds * 1000)
      : null;
    setTogglebtn(element.Type);
    setInputValue({
      description: element.Description,
      montant: element.Montant,
      categorie: element.Categorie?.trim() || "",
      Date: dateObj ? dateObj.toISOString().substring(0, 10) : "",
    });
  };

  const editeElement = async () => {
    const dateStr = inputValue.Date; // "2025-08-25"
    const newDate = new Date(dateStr); // UTC 00:00:00
    const timestamp = Timestamp.fromDate(newDate);
    setLoading(true);

    const data = {
      Montant: inputValue.montant,
      Description: inputValue.description,
      Categorie: inputValue.categorie,
      Type: togglebtn,
      Date_at: timestamp,
    };
    if (
      !togglebtn ||
      !inputValue.montant ||
      !inputValue.description ||
      !inputValue.categorie
    ) {
      setLoading(false);
      toast.warning("Veillez remplir tout les champs");

      return;
    }
    await Edited_editeElement(data, idItems);
    setLoading(false);
  };

  // useEffect(() => {
  //   editeElement();
  // }, []);

  return (
    <main className=" w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        {/* FILTRES */}
        <section className="w-full md:w-112 flex flex-col gap-4">
          <div className="bg-white flex flex-col gap-2 p-4 rounded-2xl border border-gray-200 shadow-md">
            <h1 className="text-2xl font-bold">Recherche</h1>
            <div className="flex items-center w-full relative">
              <input
                name="input"
                value={InputSelectFilter.input}
                onChange={handlechangeInputSelect}
                placeholder="Recherche une transaction..."
                type="text"
                className="px-4 outline-none placeholder:text-gray-400 p-2 w-full rounded-lg border border-gray-200 text-base"
              />
              <span className="absolute right-2 text-gray-400">
                <Search size={20} />
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-gray-200 shadow-md">
            <div className="text-xl font-bold">Période</div>
            {periode.map((items, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  checked={filter.periode === items.value}
                  onChange={() => handChange("periode", items.value)}
                  type="radio"
                  className="scale-125"
                />
                <span className="text-base">{items.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 bg-white p-4 rounded-2xl border border-gray-200 shadow-md">
            <div className="text-xl font-bold">Type</div>
            {Type.map((items, index) => (
              <div key={index} className="flex items-center gap-4">
                <input
                  checked={filter.Type === items.value}
                  onChange={() => handChange("Type", items.value)}
                  type="radio"
                  className="scale-125"
                />
                <span className="text-base">{items.text}</span>
              </div>
            ))}
          </div>

          <div className="bg-white flex flex-col gap-2 p-4 rounded-2xl border border-gray-200 shadow-md">
            <h1 className="text-2xl font-bold">Catégories</h1>
            <select
              value={InputSelectFilter.select}
              onChange={handlechangeInputSelect}
              className="outline-none text-base border border-gray-200 rounded-lg p-2 w-full"
              name="select"
            >
              {Categories.map((items, index) => (
                <option key={index} value={items.value}>
                  {items.text}
                </option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={renitialisation}
              className="cursor-pointer hover:text-white flex gap-2 items-center justify-center font-semibold hover:bg-gray-400 hover:scale-105 text-base bg-gray-200 text-gray-500 p-2 w-full rounded-xl"
            >
              <RefreshCcw size={18} /> Rénitialiser les filtres
            </button>
          </div>
        </section>

        {/* HISTORIQUE DES TRANSACTIONS */}
        <section className="w-full">
          <div className="bg-white flex flex-col gap-4 border w-full border-gray-200 shadow-md rounded-2xl">
            <div className="flex justify-between items-center px-4 py-4 flex-wrap gap-2">
              <h1 className="text-2xl font-bold">
                Historique des transactions
              </h1>
              <p className="text-base text-gray-500">
                {transactionFilter?.length} transaction(s)
              </p>
            </div>

            <div className="flex flex-col border-b border-gray-200">
              {StartItems?.map((items, index) => (
                <div key={index} className="grid items-center relative">
                  <div className="hover:bg-gray-300 cursor-pointer border-gray-200 border-t px-2 py-2 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex gap-2 items-center flex-1 min-w-0">
                      {(() => {
                        const categoryInfo = categoriesWithIcons.find(
                          (c) => c.value === items.Categorie
                        ) || {
                          icon: <BadgeDollarSign size={16} />,
                          color: "#9ca3af",
                        };
                        return (
                          <span
                            className="w-8 h-8 rounded-xl grid justify-center items-center shrink-0"
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
                      <div className="flex flex-col gap-1 truncate">
                        <span className="text-sm font-semibold truncate">
                          {items.Description}
                        </span>
                        <span className="text-xs font-light text-gray-500 truncate">
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
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-sm ${
                          items.Type === "Dépense"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {items.Type === "Dépense" ? "-" : "+"}
                        {items.Montant} {devise}
                      </span>
                      <button
                        onClick={() => {
                          setElement(index);
                          setToggle(!toggle);
                        }}
                        className="cursor-pointer hover:bg-gray-400 w-8 h-8 rounded-md grid justify-center items-center"
                      >
                        <EllipsisVertical size={16} />
                      </button>
                    </div>
                  </div>

                  {element === index && toggle && (
                    <div
                      ref={divRef}
                      className="bg-white absolute right-2 z-10 top-12 text-sm w-56 flex flex-col gap-1 rounded-xl py-1 border border-gray-200 shadow-lg"
                    >
                      <span
                        onClick={() => {
                          setActive(!active);
                          itemsModifie(items.id);
                          setIdItems(items.id);
                          setElement(null);
                        }}
                        className="flex text-gray-500 font-light hover:bg-gray-200 py-1 px-2 cursor-pointer items-center gap-2"
                      >
                        <Pen size={16} color="gray" /> Modifier
                      </span>
                      <span
                        onClick={() => {
                          supprimerDonner(items.id), setElement(null);
                        }}
                        className="flex text-red-500 hover:bg-red-200 py-1 px-2 cursor-pointer items-center gap-2"
                      >
                        <Trash size={16} color="red" /> Supprimer
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center py-4 px-2 text-sm flex-wrap gap-2">
              <div className="text-gray-400">
                Page {currentPage} sur {totalPage}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  disabled={currentPage === 1}
                  onClick={() => ToggglePage(currentPage - 1)}
                  className="bg-gray-400 w-8 h-8 rounded-xl disabled:opacity-50 hover:scale-105 transition"
                >
                  <ChevronLeft />
                </button>
                {getPageNumbers().map((p, idx) =>
                  p === "..." ? (
                    <span key={"dot-" + idx} className="px-2">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => ToggglePage(p)}
                      className={`w-8 h-8 text-sm rounded-xl ${
                        currentPage === p
                          ? "bg-blue-700 text-white"
                          : "bg-white"
                      } hover:scale-105 transition`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  disabled={currentPage === totalPage}
                  onClick={() => ToggglePage(currentPage + 1)}
                  className="bg-gray-400 w-8 h-8 rounded-xl disabled:opacity-50 hover:scale-105 transition"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MODAL AJOUT RAPIDE */}
        {active && (
          <section className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
            <div className="bg-white p-4 w-full md:w-112 max-w-2xl flex flex-col gap-4 shadow-md rounded-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center cursor-pointer">
                <span className="text-2xl font-semibold">Ajout rapide</span>
                <span onClick={() => setActive(false)} className="md:text-2xl">
                  x
                </span>
              </div>
              <div className="bg-gray-300 cursor-pointer rounded-xl p-2 w-full flex justify-between md:flex-nowrap items-center gap-2 ">
                {btn.map((items, index) => (
                  <button
                    onClick={() => setTogglebtn(items.name)}
                    key={index}
                    className={`${items.color} ${
                      togglebtn === items.name ? "bg-white rounded-lg p-2" : ""
                    } text-base flex items-center gap-2 w-full md:w-full justify-center  cursor-pointer transition-all`}
                  >
                    {items.icon} {items.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {/* Montant */}
                <label className="flex flex-col gap-2">
                  <span className="text-base">Montant</span>
                  <input
                    value={inputValue.montant}
                    name="montant"
                    onChange={handleChange}
                    placeholder="0.00"
                    type="number"
                    className="border border-gray-300 p-2 w-full rounded-xl outline-none focus:border-blue-300 text-base"
                  />
                </label>

                {/* Description */}

                <label className="flex flex-col gap-2">
                  <span className="text-base">Description</span>
                  <input
                    value={inputValue.description}
                    name="description"
                    onChange={handleChange}
                    placeholder="Ex: Courses du matin"
                    type="text"
                    className="border border-gray-300 p-2 w-full rounded-xl outline-none focus:border-blue-300 text-base"
                  />
                </label>

                {/* Catégorie */}
                <label className="flex flex-col gap-2">
                  <span className="text-base">Catégorie</span>
                  <select
                    value={inputValue.categorie}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 w-full rounded-xl outline-none focus:border-blue-300 text-base"
                    name="categorie"
                  >
                    <option value="">Choisir la catégorie</option>
                    {Categories?.map((items, index) => (
                      <option key={index} value={items.text}>
                        {items.text}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Date */}
                <label className="flex flex-col gap-2">
                  <span className="text-base">Date</span>
                  <input
                    value={inputValue.Date}
                    name="Date"
                    onChange={handleChange}
                    type="date"
                    className="border border-gray-300 p-2 w-full rounded-xl outline-none focus:border-blue-300 text-base"
                  />
                </label>
              </div>

              {/* Boutons Annuler / Sauvegarder */}
              <div className="flex flex-col md:flex-row items-center gap-2 mt-4">
                <button
                  onClick={() => setActive(false)}
                  className="text-base p-2 cursor-pointer font-semibold rounded-xl w-full md:w-1/2 grid justify-center border border-gray-200"
                >
                  Annuler
                </button>

                <div
                  onClick={editeElement}
                  className={`w-full md:w-1/2 ${
                    togglebtn === "Dépense" ? "bg-red-500" : "bg-green-500"
                  } text-white font-semibold grid justify-center items-center rounded-xl p-2 cursor-pointer`}
                >
                  <button className="text-base flex items-center gap-2 cursor-pointer w-full justify-center">
                    {loadings ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full border-b-transparent border-2 p-2 border-violet-400"></div>
                        Chargement...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save size={20} /> Sauvegarder
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Recherche_transaction;
