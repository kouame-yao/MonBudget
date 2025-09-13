import { User } from "lucide-react";

function Profil_Utilisateur({ profilData, handleChange }) {
  const devise = [
    { devise: "€", name: "EURO" },
    { devise: "$", name: "DOLLAR" },
    { devise: "Fr", name: "FRCFA" },
  ];

  return (
    <div>
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-lg w-full p-8 flex flex-col gap-8 ">
        <div className="flex gap-4 items-center ">
          <span className="bg-blue-200 text-blue-500 w-12 h-12 rounded-2xl grid items-center justify-center">
            <User size={20} />
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Profil utilisateur</span>
            <span className="text-sm font-light text-gray-500">
              Gérez vos informations personnelles
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <label htmlFor="">
            <span className="text-sm text-gray-500">Nom complet</span>
            <input
              onChange={handleChange}
              value={profilData.nom}
              name="nom"
              type="text"
              className="border-2 outline-none p-1 rounded-lg border-gray-200 w-full"
            />
          </label>
          <label htmlFor="">
            <span className="text-sm text-gray-500">Email</span>
            <input
              onChange={handleChange}
              value={profilData.email}
              name="email"
              type="text"
              disabled
              className="border-2 disabled:text-gray-300 outline-none p-1 rounded-lg border-gray-200 w-full"
            />
          </label>
          <label htmlFor="">
            <span className="text-sm text-gray-500">Devise</span>
            <select
              onChange={handleChange}
              value={profilData?.devise ?? ""}
              name="devise"
              id=""
              className="border-2 outline-none p-1 rounded-lg border-gray-200 appearance-none w-full"
            >
              {devise.map((items, index) => {
                return (
                  <option key={index} value={items.devise}>
                    {items.name}({items.devise})
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Profil_Utilisateur;
