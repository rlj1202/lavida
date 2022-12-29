import { NextPage } from "next";
import Head from "next/head";
import Layout from "../../components/Layout";
import Config from "../../config";

const Boards: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${Config.title} - Boards`}</title>
      </Head>

      <Layout>
        <h1>Boards</h1>
      </Layout>
    </>
  );
};

export default Boards;
