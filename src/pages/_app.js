import "@/styles/globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "../../Auth/Authentification";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <Component {...pageProps} />
    </AuthProvider>
  );
}
