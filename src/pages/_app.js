import "@/styles/globals.css";
import { AuthProvider } from "../../Auth/Authentification";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
