import {
  FileQuestion,
  LogOut,
  Menu,
  Settings,
  User,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../Auth/Authentification";
import Login_overlay from "../components/acceuil/Login_overlay";

function Wrapper({ children }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user && router.pathname !== "/") router.push("/");
  }, [loading, user, router]);
  const [active, setActive] = useState(router.pathname);
  const [toggle, setToggle] = useState(false);
  const [ModalConnect, setModalConnect] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const divRef = useRef(null);

  useEffect(() => setActive(router.pathname), [router.pathname]);
  useEffect(() => {
    function handleClickOutside(event) {
      // Si on clique en dehors de la div
      if (divRef.current && !divRef.current.contains(event.target)) {
        setMobileMenu(false);
        setToggle(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const btnNav = [
    { name: "Tableau de bord", href: "/dashboard" },
    { name: "Transactions", href: "/transactions" },
    { name: "Analyses", href: "/analyses" },
    { name: <User /> },
    { name: "Se connecter" },
  ];

  const handleClick = (item, index) => {
    if (index === 3) setToggle(!toggle);
    else if (index === 4) setModalConnect(true);
    else {
      setActive(item.href);
      router.push(item.href);
    }
    setMobileMenu(false);
  };

  return (
    <div>
      <header className="flex justify-between items-center px-4 md:px-12 py-4 bg-white shadow-md relative">
        <div className="flex items-center gap-4">
          <span className="bg-blue-600 w-12 h-12 grid place-items-center text-white text-sm rounded-2xl">
            <Wallet size={30} />
          </span>
          <span className="text-2xl md:text-4xl font-bold">MonBudjet</span>
        </div>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center gap-6 text-gray-500 text-lg">
          {btnNav.map((item, index) => {
            if (loading && index === 4) return null;
            const Active = router.pathname === item.href;
            const classUser =
              index === 3 &&
              "bg-gray-200 h-10 w-10 grid place-items-center rounded-full";
            return (
              <div
                key={index}
                onClick={() => handleClick(item, index)}
                className={`${classUser} ${Active ? "text-blue-500" : ""} ${
                  index === 3 && !user ? "hidden" : ""
                } ${index === 4 && user ? "hidden" : ""} ${
                  index !== 4 && !user && "hidden"
                } ${
                  index === 4 &&
                  "bg-blue-500 p-2 rounded-lg px-4 text-white shadow-lg active:scale-105 "
                } cursor-pointer`}
              >
                {item.name}
              </div>
            );
          })}
        </div>

        {/* Bouton menu mobile */}
        <div
          className="md:hidden cursor-pointer"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <Menu size={28} />
        </div>
      </header>

      {/* Menu mobile */}
      {mobileMenu && (
        <div
          ref={divRef}
          className="fixed top-16 right-0 w-64 bg-white shadow-lg rounded-b-2xl z-20 p-4 flex flex-col gap-3 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          {btnNav.map((item, index) => {
            const afiche = index !== 4 && !user && "hidden";
            const masc = index === 4 && user && "hidden";

            return (
              <div
                key={index}
                onClick={() => handleClick(item, index)}
                className={`p-2 rounded-lg cursor-pointer text-gray-700 ${
                  active === item.href ? "bg-blue-100 text-blue-600" : ""
                }${afiche} ${masc} `}
              >
                {item.name}
              </div>
            );
          })}
        </div>
      )}

      {/* Menu utilisateur dropdown */}
      {toggle && !mobileMenu && (
        <div
          ref={divRef}
          className="absolute top-16 right-4 bg-white border border-gray-100 rounded-2xl shadow-2xl z-10 w-72"
        >
          <div className="border-b border-gray-200 py-2 px-3 flex flex-col gap-1">
            <span className="font-semibold">{user?.displayName}</span>
            <span className="text-gray-400 text-sm">{user?.email}</span>
          </div>
          <div className="border-b border-gray-200 text-gray-500 flex flex-col gap-2 ">
            <span
              onClick={() => router.push("/parametre")}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              <Settings /> Paramètre
            </span>
            <span className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
              <FileQuestion /> Aide
            </span>
          </div>
          <div
            onClick={() => logout()}
            className="flex items-center gap-2 p-2 cursor-pointer text-red-500 hover:text-white hover:bg-red-300 rounded mt-1  rounded-b-2xl"
          >
            <LogOut /> Déconnexion
          </div>
        </div>
      )}

      <main className="px-4 md:px-12 mt-8">{children}</main>
      {ModalConnect && <Login_overlay Close={() => setModalConnect(false)} />}
    </div>
  );
}

export default Wrapper;
