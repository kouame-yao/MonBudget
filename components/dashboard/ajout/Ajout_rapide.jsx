import { collection, doc, setDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../Auth/Authentification";
import { db } from "../../../database/firebase/auth";
export default function Ajout_rapide() {
  const { user, connectGoogle, logout } = useAuth();
  const uid = user?.uid;
  const [togglebtn, setTogglebtn] = useState("Dépense");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    montant: "",
    description: "",
    categorie: "",
  });
  const Categories = {
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
  const date = new Date(); // par exemple : 2025-08-24
  const options = { year: "numeric", month: "long" };
  const formatted = date.toLocaleDateString("fr-FR", options);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };
  const transaction = async () => {
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
      const usercRef = doc(collection(db, "users", uid, "transactions"));
      await setDoc(usercRef, {
        Type: togglebtn,
        Montant: Number(inputValue.montant),
        Description: inputValue.description,
        Categorie: inputValue.categorie,
        Date_at: new Date(),
        Mois: formatted, // "août 2025"
      });
      setLoading(false);
      setInputValue({
        montant: "",
        description: "",
        categorie: "",
      });
      console.log("Transaction ajouter avec succès !");
    } catch (e) {
      console.error("Error adding document: ", e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white p-8 w-full flex flex-col gap-8 shadow-md rounded-3xl border-4 border-gray-200">
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
              {Categories[togglebtn]?.map((items, index) => {
                return (
                  <option key={index} value={items.text}>
                    {items.text}{" "}
                  </option>
                );
              })}
            </select>
          </label>
        </div>

        <div
          onClick={transaction}
          className={`w-full ${
            togglebtn === "Dépense" ? "bg-red-500" : "bg-green-500"
          } text-white font-semibold grid justify-center items-center rounded-2xl p-5 cursor-pointer`}
        >
          <button className="text-2xl flex items-center gap-8 cursor-pointer">
            {loading ? (
              <div className="flex items-center gap-4">
                <div className=" animate-spin  rounded-full border-b-transparent border-4 p-4 border-violet-400 "></div>
                <div>Chargement...</div>
              </div>
            ) : (
              <>
                {togglebtn === "Dépense"
                  ? "+ Ajouter la dépenses"
                  : "+ Ajouter la Revenu"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
