import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import Config from '../config';
import Layout from '../components/Layout';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Layout>
        <Head>
          <title>{Config.title}</title>
        </Head>

        <div className="wrapper">
          <h1>Lavida</h1>
          <div>공사 중입니다.</div>
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
}
