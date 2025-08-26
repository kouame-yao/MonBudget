import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../Auth/Authentification";
import Acceuil from "../../components/acceuil/Acceuil";
import Wrapper from "../../layout/Wrapper";

function index() {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if ((loading, user)) {
      router.push("/dashboard");
    }
  }, [loading, user]);
  return (
    <Wrapper>
      <Acceuil />
    </Wrapper>
  );
}

export default index;
