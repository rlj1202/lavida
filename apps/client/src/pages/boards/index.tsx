import { NextPage } from "next";
import Head from "next/head";

import Layout from "../../components/Layout";
import Config from "../../config";

const Boards: NextPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Boards`}</title>
        </Head>

        <h1>Boards</h1>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default Boards;
