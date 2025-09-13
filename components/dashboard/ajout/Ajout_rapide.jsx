import { collection, doc, setDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../../Auth/Authentification";

export default function Ajout_rapide() {
  const { transactions } = useAuth();
  const [togglebtn, setTogglebtn] = useState("Dépense");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    montant: "",
    description: "",
    categorie: "",
  });

  const Categories = {
    Dépense: [
      "Alimentation",
      "Transport",
      "Logement",
      "Loisirs",
      "Santé",
      "Shopping",
      "Factures",
      "Autres",
    ],
    Revenu: ["Salaire", "Investissement", "Cadeaux", "Autres"],
  };

  const btn = [
    { name: "Dépense", icon: <ArrowDown />, color: "text-red-500" },
    { name: "Revenu", icon: <ArrowUp />, color: "text-green-500" },
  ];

  const date = new Date();
  const formatted = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  };

  const newTransactions = async () => {
    setLoading(true);
    if (
      !togglebtn ||
      !inputValue.montant ||
      !inputValue.description ||
      !inputValue.categorie
    ) {
      toast.error("Des champs sont manquants !");
      setLoading(false);
      return;
    }
    await transactions({
      Type: togglebtn,
      Montant: Number(inputValue.montant),
      Description: inputValue.description,
      Categorie: inputValue.categorie,
      Date_at: new Date(),
      Mois: formatted,
    });
    setInputValue({ montant: "", description: "", categorie: "" });
    setLoading(false);
  };
  return (
    <div className="w-full max-w-md md:max-w-2xl mx-auto ">
      <div className="bg-white p-4 md:p-6 flex flex-col gap-4 md:gap-6 shadow-md rounded-2xl border border-gray-200">
        <span className="text-lg md:text-xl font-semibold">Ajout rapide</span>

        <div className="flex gap-2 bg-gray-200 rounded-xl p-1">
          {btn.map((item) => (
            <button
              key={item.name}
              onClick={() => setTogglebtn(item.name)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 md:py-3 rounded-lg transition ${
                togglebtn === item.name ? "bg-white shadow font-semibold" : ""
              } ${item.color}`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:gap-4">
          <label className="flex flex-col gap-1 md:gap-2 text-base md:text-lg">
            Montant
            <input
              type="number"
              name="montant"
              value={inputValue.montant}
              onChange={handleChange}
              placeholder="0.00"
              className="border border-gray-300 rounded-lg p-3 text-base md:text-lg placeholder:text-gray-400 outline-none focus:border-blue-400"
            />
          </label>

          <label className="flex flex-col gap-1 md:gap-2 text-base md:text-lg">
            Description
            <input
              type="text"
              name="description"
              value={inputValue.description}
              onChange={handleChange}
              placeholder="Ex: Courses du matin"
              className="border border-gray-300 rounded-lg p-3 text-base md:text-lg placeholder:text-gray-400 outline-none focus:border-blue-400"
            />
          </label>

          <label className="flex flex-col gap-1 md:gap-2 text-base md:text-lg">
            Catégorie
            <select
              name="categorie"
              value={inputValue.categorie}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-3 text-base md:text-lg outline-none focus:border-blue-400"
            >
              <option value="">Choisir la catégorie</option>
              {Categories[togglebtn].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          onClick={newTransactions}
          className={`w-full py-3 md:py-4 rounded-lg font-semibold text-white transition ${
            togglebtn === "Dépense"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading
            ? "Chargement..."
            : togglebtn === "Dépense"
            ? "Ajouter la dépense"
            : "Ajouter le revenu"}
        </button>
      </div>
    </div>
  );
}
