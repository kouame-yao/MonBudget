import { Bell, Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Auth/Authentification";

export default function NotificationBell() {
  const { Get_transactions, notifications, Edited_notif, supprimerNotif } =
    useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [hiOpen, sethiOpen] = useState(false);
  const divRef = useRef();
  const length = notifications?.filter((doc) => doc?.read === true)?.length;
  useEffect(() => {
    function handleClickOutside(event) {
      // Si on clique en dehors de la div
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative" ref={divRef}>
      {/* Cloche */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-gray-900 relative"
      >
        <Bell size={24} />

        {/* Bulle avec le nombre de notifications du jour */}
        {notifications?.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {length}
          </span>
        )}
      </button>

      {/* Liste des notifications */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif, i) => (
                <li
                  key={i}
                  className={`p-4 flex items-start justify-between ${
                    !notif.read ? "" : "bg-blue-200"
                  }`}
                >
                  {/* Contenu */}
                  <div className="flex items-start flex-1">
                    <div className="mr-3">
                      {notif.icon === "bell" && (
                        <Bell
                          size={20}
                          className={`${
                            notif.read ? "text-blue-400" : "bg-blue-500"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(
                          notif.createdAt.seconds * 1000
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex  flex-col space-y-1">
                    <button
                      onClick={() => Edited_notif(notif.id)}
                      className="text-green-500 hover:text-green-700 font-bold cursor-pointer"
                    >
                      <Check />
                    </button>
                    <button
                      onClick={() => supprimerNotif(notif.id)}
                      className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
                    >
                      <X />
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-4 text-gray-500 text-sm">Aucune notification</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
