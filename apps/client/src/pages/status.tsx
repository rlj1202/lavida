import { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Config from "../config";

const Status: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${Config.title} - Status`}</title>
      </Head>

      <Layout>
        <h1>Status</h1>
      </Layout>
    </>
  );
};

export default Status;
