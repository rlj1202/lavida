import { NextPage } from "next";
import Head from "next/head";
import Layout from "../../components/Layout";
import Config from "../../config";

const Contests: NextPage = () => {
  return (
    <>
      <Head>
        <title>{`${Config.title} - Contests`}</title>
      </Head>

      <Layout>
        <h1>Contests</h1>
      </Layout>
    </>
  );
};

export default Contests;
