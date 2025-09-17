// AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { auth, db } from "../database/firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Get_transactions, setTransaction] = useState([]);
  const [devise, Setdevise] = useState("");
  const [configue, Setconfigue] = useState([]);
  const [notifications, setNotifications] = useState([]);
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
      const gestionBudget = doc(
        db,
        "users",
        user?.uid,
        "BudgetSetting",
        "Configue"
      );

      // Enregistrer les informations de l'utilisateur (merge = true pour ne pas écraser)
      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          devise: "Fr",
          lastLogin: new Date(),
        },
        { merge: true } // merge = true => update si le doc existe déjà
      );

      await setDoc(
        gestionBudget,
        {
          limite: 0,
          objectif: 0,
          alerte: 0,
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
  // Get transaction

  useEffect(() => {
    if (loading || !user?.uid) return;

    const colRef = collection(db, "users", user.uid, "transactions");

    const q = query(colRef, orderBy("Date_at", "desc"));
    // "asc" = de l'ancien au plus récent
    // ou "desc" = du plus récent à l'ancien

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const table = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const montant =
          typeof data.Montant === "string"
            ? parseFloat(data.Montant)
            : data.Montant;
        table.push({ id: doc.id, ...data, Montant: montant || 0 });
      });

      setTransaction(table);
    });

    return () => unsubscribe();
  }, [loading, user?.uid]);

  // Ajout de transaction
  const date = new Date();
  const formatted = date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });

  const transactions = async (data) => {
    if (!user?.uid) {
      toast.error("Utilisateur non connecté !");
      return;
    }

    try {
      const usercRef = doc(collection(db, "users", user?.uid, "transactions"));
      await setDoc(usercRef, data);
      toast.success(`${data.Type} ajouter avec succès`);
    } catch (e) {
      toast.error(`Error adding document: ${e.message}`);
    } finally {
    }
  };

  // Modifier transaction

  const Edited_editeElement = async (data, idItems) => {
    if (!user?.uid) {
      toast.error("uid Manquant");
      return;
    }
    try {
      const washingtonRef = doc(
        db,
        "users",
        user?.uid,
        "transactions",
        idItems
      );

      // Set the "capital" field of the city 'DC'
      await updateDoc(washingtonRef, data);

      toast.success("Modification reussi");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Supprimer transaction

  const supprimerDonner = async (id) => {
    if (!user?.uid) {
      toast.error("uid Manquant");
      return;
    }
    try {
      const washingtonRef = doc(db, "users", user?.uid, "transactions", id);

      await deleteDoc(washingtonRef);
      toast.success("Suppression reussi");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // modifier le profil

  const editeDisplaynam = async (data) => {
    updateProfile(auth.currentUser, {
      displayName: data,
    })
      .then(() => {
        toast.success("Profil modifier avec succes");
      })
      .catch((error) => {
        // An error occurred
        // ...

        toast.error(error.message);
      });
  };

  // ajout de devise

  const deviseAdd = async (data) => {
    if (!user?.uid) return;
    try {
      const washingtonRef = doc(db, "users", user?.uid);
      await updateDoc(washingtonRef, {
        devise: data,
      });
      toast.success("Dévise mise ajour");
    } catch (error) {
      toast.error("Impossible de mettre ajour la dévise");
    }
  };

  // RECUPERATION DES DONNER DE PARAMETTRE
  useEffect(() => {
    if (loading || !user?.uid) return;

    // Écoute en direct du champ devise
    const unsubscribeUser = onSnapshot(
      doc(db, "users", user.uid),
      (docSnap) => {
        Setdevise(docSnap?.data()?.devise);
      }
    );

    // Écoute en direct de la collection BudgetSetting
    const configRef = collection(db, "users", user.uid, "BudgetSetting");
    const unsubscribeConfig = onSnapshot(configRef, (querySnapshot) => {
      const table = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      Setconfigue(table);
    });

    // Nettoyage correct des deux listeners
    return () => {
      unsubscribeUser();
      unsubscribeConfig();
    };
  }, [loading, user?.uid]);

  const editeConfigue = async (data) => {
    if (!user?.uid) {
      toast.error("uid Manquant");
      return;
    }
    try {
      const washingtonRef = doc(
        db,
        "users",
        user?.uid,
        "BudgetSetting",
        "Configue"
      );

      // Set the "capital" field of the city 'DC'
      await updateDoc(washingtonRef, data);

      toast.success("Modification reussi");
    } catch (error) {
      toast.error(error.message);
    }
  };
  //Ajout de notifications
  const Alertes = async (data) => {
    if (!user?.uid) {
      toast.error("uid manquant");
      return;
    }

    try {
      const notifRef = collection(db, "users", user?.uid, "Notifications");
      await addDoc(notifRef, data);

      toast.success("Notification ajoutée !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l’ajout");
    }
  };

  // Get notifications
  useEffect(() => {
    if (loading || !user?.uid) return;
    onSnapshot(doc(db, "users", user?.uid), (doc) => {
      Setdevise(doc?.data()?.devise);
    });
    const table = [];
    const config = collection(db, "users", user?.uid, "Notifications");
    const q = query(config, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notifs);
      return () => unsubscribe();
    });
  }, [user]);

  // modifier les notifications
  const Edited_notif = async (idItems) => {
    if (!user?.uid) {
      toast.error("uid Manquant");
      return;
    }
    try {
      const washingtonRef = doc(
        db,
        "users",
        user?.uid,
        "Notifications",
        idItems
      );

      // Set the "capital" field of the city 'DC'
      await updateDoc(washingtonRef, {
        read: false,
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  // supprimer notifications

  const supprimerNotif = async (id) => {
    if (!user?.uid) {
      toast.error("uid Manquant");
      return;
    }
    try {
      const washingtonRef = doc(db, "users", user?.uid, "Notifications", id);

      await deleteDoc(washingtonRef);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        connectGoogle,
        logout,
        transactions,
        Get_transactions,
        Edited_editeElement,
        supprimerDonner,
        editeDisplaynam,
        devise,
        deviseAdd,
        configue,
        editeConfigue,
        Alertes,
        notifications,
        Edited_notif,
        supprimerNotif,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
