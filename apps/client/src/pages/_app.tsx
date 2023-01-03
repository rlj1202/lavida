import "../styles/globals.css";

import type { AppProps } from "next/app";
import Head from "next/head";

import { Provider } from "react-redux";

import Config from "../config";
import store, { persistor } from "../store";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <meta name="description" content={Config.description} />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
