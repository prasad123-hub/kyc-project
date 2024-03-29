import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { Toaster } from "@/components/Toaster";
import { AuthProvider } from "@/context/AuthContext";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <Component {...pageProps} />
          <Toaster />
        </AuthProvider>
      </Provider>
    </>
  );
}
