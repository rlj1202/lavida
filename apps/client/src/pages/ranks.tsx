import { NextPage } from "next";
import Head from "next/head";

import Layout from "../components/Layout";

const Ranks: NextPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`Ranks`}</title>
        </Head>

        <h1>Ranks</h1>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default Ranks;
