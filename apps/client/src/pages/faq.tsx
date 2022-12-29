import { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Config from "../config";

const Faq: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${Config.title} - FAQ`}</title>
      </Head>

      <Layout>
        <h1>FAQ</h1>
      </Layout>
    </>
  );
};

export default Faq;
