import Head from 'next/head';
import React from 'react';
import Config from '../config';
import Container from './Container';
import Footer from './Footer';
import Topbar from './Topbar';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <Head>
        <title>{Config.title}</title>
        <meta name="description" content={Config.description} />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Topbar />
      <Container>{children}</Container>
      <Footer />

      <style jsx>{``}</style>
    </div>
  );
};

export default Layout;
