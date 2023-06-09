import { NextPage } from 'next';
import Head from 'next/head';

import Layout from '../components/Layout';
import Config from '../config';

const Faq: NextPage = () => {
  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - FAQ`}</title>
        </Head>

        <div className="wrapper">
          <h1>FAQ</h1>

          <h2>Q. 대충 여기다가 질문을 적고</h2>
          <p>대충 여기다가 답변을 적을 예정입니다.</p>
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

export default Faq;
