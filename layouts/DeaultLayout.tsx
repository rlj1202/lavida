import Head from 'next/head';

import Topbar from '../components/topbar';
import Footer from '../components/footer';
import { ReactNode } from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Lavida</title>
      </Head>

      <Topbar />

      <div className="wrapper">
        { children }
      </div>

      <Footer />

      <style jsx>{`
        .wrapper {
          padding: 0 40px;
          max-width: 1000px;
          margin: 50px auto;
        }
      `}</style>
    </>
  );
}