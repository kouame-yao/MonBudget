import { FileQuestion, LogOut, Settings, User, Wallet } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../Auth/Authentification";
import Login_overlay from "../components/acceuil/Login_overlay";

function Wrapper({ children }) {
  const { user, connectGoogle, logout, loading } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);
  const [toggle, setToggle] = useState(false);
  const [ModalConnect, setModalConnect] = useState(false);
  useEffect(() => {
    setActive(router.pathname);
  }, []);

  const btnNav = [
    { name: "Tableau de bord", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
    { name: "Analyses", href: "/analyses" },
    { name: <User /> },
    { name: "Se connecter" },
  ];

  const affiche = () => {
    setModalConnect(true);
  };
  const deconnextion = () => {
    logout;
  };
  useEffect(() => {
    if (loading) return;

    if (!user && router.pathname !== "/") {
      router.push("/");
    }
  }, [loading, user, router]);
  return (
    <div>
      <div>
        <div className="flex relative justify-between px-45  bg-white p-8 shadow-md ">
          <div className="flex place-items-center gap-4">
            {" "}
            <span className="bg-blue-600 w-12 h-12 place-items-center grid items-center text-white text-sm rounded-2xl">
              <Wallet size={30} />
            </span>
            <span className=" text-4xl font-bold">MonBudjet</span>
          </div>

          <div className="flex cursor-pointer text-2xl font-light text-gray-500 gap-8 items-center ">
            {btnNav.map((item, index) => {
              if (loading && index === 4) {
                return null;
              }
              const Active = router.pathname === item.href;
              const classUser =
                index === 3 &&
                "bg-gray-200 cursor-pointer h-12 w-12 grid items-center place-items-center rounded-full";
              return (
                <div
                  onClick={() => {
                    if (index !== 3 && index !== 4) {
                      setActive(item.href);
                      router.push(item.href);
                    }
                    if (index === 3) {
                      setToggle(!toggle);
                    }
                    if (index === 4) {
                      affiche();
                    }
                  }}
                  className={`${classUser} ${
                    active === item.href ? "text-blue-500" : ""
                  } ${index === 3 && !user && "hidden"} ${
                    index === 4 && user && "hidden"
                  } ${
                    index === 4 && "bg-blue-500 p-4 rounded-2xl text-white"
                  } `}
                  key={index}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>
        {toggle && (
          <div className="bg-white z-10 absolute py-5 right-50 top-25 w-90  border border-gray-100 rounded-2xl shadow-2xl text-2xl">
            <div className="border-b-4 border-gray-100 flex flex-col gap-2 px-4 py-4">
              <span className="font-semibold">{user.displayName}</span>
              <span className="text-gray-400">{user.email}</span>
            </div>
            <div className="border-b-4  border-gray-100 text-gray-400 flex flex-col gap-2 px-4 py-4">
              <span
                onClick={() => router.push("/parametre")}
                className="flex hover:bg-gray-400 rounded-md hover:text-black p-2 cursor-pointer items-center gap-4"
              >
                <Settings /> Paramètre
              </span>
              <span className="flex  hover:bg-gray-400 rounded-md hover:text-black p-2 items-center gap-4 cursor-pointer ">
                <FileQuestion /> Aide
              </span>
            </div>
            <div
              onClick={logout}
              className="flex cursor-pointer hover:bg-red-400 hover:rounded-md mt-2 hover:text-white text-red-500 items-center gap-4 p-2"
            >
              <LogOut /> Déconnextion
            </div>
          </div>
        )}
      </div>

      <div className="px-45 mt-10">{children}</div>
      {ModalConnect && <Login_overlay Close={() => setModalConnect(false)} />}
    </div>
  );
}

export default Wrapper;
