import { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Config from "../config";

const Tools: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${Config.title} - Tools`}</title>
      </Head>

      <Layout>
        <h1>Tools</h1>
      </Layout>
    </>
  );
};

export default Tools;
