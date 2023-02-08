import "../styles/globals.css";

import type { AppProps } from "next/app";

import { Provider } from "react-redux";

import store, { persistor } from "../store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
