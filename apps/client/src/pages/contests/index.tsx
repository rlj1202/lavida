import { NextPage } from "next";
import Head from "next/head";

import Layout from "../../components/Layout";
import Config from "../../config";

const Contests: NextPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Contests`}</title>
        </Head>

        <h1>Contests</h1>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default Contests;
