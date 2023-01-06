import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Config from "../config";
import Layout from "../components/Layout";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Layout>
        <Head>
          <title>{Config.title}</title>
        </Head>

        <div>test</div>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
}
