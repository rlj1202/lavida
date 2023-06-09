import { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../components/Layout';

const Ranks: NextPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`Ranks`}</title>
        </Head>

        <div className="wrapper">
          <h1>Ranks</h1>
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

export default Ranks;
