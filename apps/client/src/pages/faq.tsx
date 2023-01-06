import { NextPage } from "next";
import Head from "next/head";

import Layout from "../components/Layout";
import Config from "../config";

const Faq: NextPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - FAQ`}</title>
        </Head>

        <h1>FAQ</h1>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default Faq;
