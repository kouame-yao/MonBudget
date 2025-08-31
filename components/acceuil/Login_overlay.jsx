import { Wallet } from "lucide-react";

import { useAuth } from "../../Auth/Authentification";

function Login_overlay({ Close }) {
  const { connectGoogle } = useAuth();

  return (
    <div className="fixed px-2 w-screen flex flex-col justify-center items-center h-screen z-10 top-0 right-0 bg-black/50">
      <div className="bg-white rounded-2xl md:w-150 w-full py-4 grid gap-10">
        <div className="p-4 flex justify-between w-full border-b-2 px-8 border-gray-200 ">
          <span className="font-bold md:text-lg sm:text-sm">Connextion</span>
          <span
            onClick={Close}
            className="md:text-lg sm:text-sm font-semibold text-gray-500 cursor-pointer"
          >
            X
          </span>
        </div>

        <div className="flex flex-col gap-4 place-items-center px-8">
          <span className="grid justify-center  items-center w-18 h-18 bg-blue-400 text-white rounded-2xl">
            <Wallet size={40} />
          </span>
          <span className="md:text-lg sm:text-sm font-semibold">
            Bienvenue sur MonBudget
          </span>
          <span className="md:text-lg sm:text-sm font-light text-center whitespace-pre-line text-gray-500">
            Connectez-vous pour gérer vos finances personnelles
          </span>
          <span
            onClick={connectGoogle}
            className="border-2 p-4 hover:bg-gray-200 place-items-center flex justify-center font-semibold cursor-pointer rounded-2xl w-full md:text-lg sm:text-sm border-gray-200"
          >
            <span>Continuer avec google</span>
          </span>
          <div className=" text-center whitespace-pre-line text-gray-500 font-light md:text-lg sm:text-sm ">
            <span>
              En vous connectant, vous acceptez nos conditions d'utilisation et
              notre politique de confidentialité.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login_overlay;
