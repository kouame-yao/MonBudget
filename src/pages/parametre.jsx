import { Disc } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/Authentification";
import Parametres_Budget from "../../components/parametres/Parametres_Budget";
import Profil_Utilisateur from "../../components/parametres/Profil_Utilisateur";
import Wrapper from "../../layout/Wrapper";

export default function Parametre() {
  const {
    Get_transactions,
    editeDisplaynam,
    user,
    devise,
    deviseAdd,
    configue,
    editeConfigue,
  } = useAuth();

  const [input, setInput] = useState({
    nom: "",
    email: "",
    devise: "",
  });

  const [inputConfigue, setInputConfigue] = useState({
    limite: "",
    objectif: "",
    alerte: "",
  });

  // ⚙️ Remplit les champs utilisateur (nom, email, devise)
  useEffect(() => {
    if (user && devise && configue) {
      setInput({
        nom: user.displayName || "",
        email: user.email || "",
        devise: devise || "",
      });
    }
  }, [user, devise, configue]);

  // ⚙️ Remplit les paramètres de budget (limite, objectif, alerte)
  useEffect(() => {
    // Supporte le cas où `configue` est un tableau (on prend le premier élément)
    const cfg = Array.isArray(configue) ? configue[0] : configue;

    // N'écrase pas les champs si cfg est vide ou n'a pas de valeurs
    const hasUsefulConfig = Boolean(
      cfg &&
        ((cfg.limite !== undefined && cfg.limite !== "") ||
          (cfg.objectif !== undefined && cfg.objectif !== "") ||
          (cfg.alerte !== undefined && cfg.alerte !== ""))
    );

    if (user && devise && hasUsefulConfig) {
      setInputConfigue({
        // convertir en chaîne pour inputs contrôlés
        limite: String(cfg.limite ?? ""),
        objectif: String(cfg.objectif ?? ""),
        alerte: String(cfg.alerte ?? ""),
      });
    }
  }, [user, devise, configue]);

  // 🔄 Pour les champs utilisateur
  const onchange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔄 Pour les champs configue
  const onchangeConfigue = (e) => {
    const { name, value } = e.target;
    setInputConfigue((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  // 💾 Soumettre les modifications utilisateur
  const handlSubmit = () => {
    if (
      inputConfigue.alerte >= 0 &&
      inputConfigue.limite >= 0 &&
      inputConfigue.objectif >= 0
    ) {
      editeConfigue(inputConfigue);
      editeDisplaynam(input.nom);
      deviseAdd(input.devise);
    } else {
      alert("Les valeurs de budget doivent être des nombres positifs ou nuls.");
    }
    // Tu peux aussi ajouter une fonction ici pour sauvegarder inputConfigue
  };

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
          <Profil_Utilisateur profilData={input} handleChange={onchange} />
          <Parametres_Budget
            formatConfigue={inputConfigue}
            handleConfigue={onchangeConfigue}
          />
        </section>

        <section>
          <div className="flex gap-4 items-center justify-end">
            <button className="border-2 cursor-pointer border-gray-200 hover:bg-gray-400 text-black p-2 rounded-lg">
              Annuler
            </button>
            <button
              onClick={handlSubmit}
              className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white p-2 rounded-lg flex items-center gap-2"
            >
              <Disc /> Sauvegarder
            </button>
          </div>
        </section>
      </main>
    </Wrapper>
  );
}
