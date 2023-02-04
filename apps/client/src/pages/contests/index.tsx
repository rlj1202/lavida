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

        <div className="wrapper">
          <h1>Contests</h1>
        </div>
      </Layout>

      <style jsx>{`
        .wrapper > * {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

export default Contests;
