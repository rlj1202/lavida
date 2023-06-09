import { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../components/Layout';
import Config from '../config';

const Tools: NextPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Tools`}</title>
        </Head>

        <div className="wrapper">
          <h1>Tools</h1>
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

export default Tools;
