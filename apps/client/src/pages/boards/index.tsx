import { NextPage } from "next";
import Head from "next/head";

import Layout from "../../components/Layout";
import Config from "../../config";

const Boards: NextPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Boards`}</title>
        </Head>

        <div className="wrapper">
          <h1>Boards</h1>
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

export default Boards;
