import { NextPage } from "next";
import Head from "next/head";

import Layout from "../components/Layout";
import Config from "../config";

const Tools: NextPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Tools`}</title>
        </Head>

        <h1>Tools</h1>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default Tools;
