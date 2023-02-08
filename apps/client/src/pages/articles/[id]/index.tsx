import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout";
import { getArticle } from "../../../services/articles";

const ArticlePage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query as { id: string };

  const query = useQuery(["article", id], () => getArticle(id), {
    enabled: !!id,
  });

  if (query.status !== "success") {
    return <></>;
  }

  const article = query.data;

  return (
    <>
      <Layout>
        <Head>
          <title>{`${article.title}`}</title>
        </Head>

        <div className="wrapper">
          <h1>{article.title}</h1>
          <div>{article.content}</div>
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

export default ArticlePage;
