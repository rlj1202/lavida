import { NextPage } from "next";
import Head from "next/head";
import Layout from "../../components/Layout";
import Config from "../../config";

const Problems: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${Config.title} - Problems`}</title>
      </Head>

      <Layout>
        <h1>Problems</h1>
      </Layout>
    </>
  );
};

export default Problems;
