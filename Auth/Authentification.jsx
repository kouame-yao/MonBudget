// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { auth, db } from "../database/firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Surveille l'état de connexion Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fonction pour se connecter avec Google
  const connectGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Référence au document Firestore avec l'UID de l'utilisateur
      const userRef = doc(db, "users", user?.uid);

      // Enregistrer les informations de l'utilisateur (merge = true pour ne pas écraser)
      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        },
        { merge: true } // merge = true => update si le doc existe déjà
      );
      setUser(user);
      toast.success("Vous êtes connecté !");
      router.push("/dashboard"); // met à jour le contexte
    } catch (error) {
      console.error("Erreur connexion Google :", error);
    }
  };

  // Fonction pour se déconnecter
  const logout = async () => {
    router.push("/");
    await signOut(auth);

    setUser(null);
    toast.success("Vous êtes déconnecter !");
  };

  return (
    <AuthContext.Provider value={{ user, loading, connectGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
