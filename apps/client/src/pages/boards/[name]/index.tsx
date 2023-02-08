import { NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import Layout from "../../../components/Layout";
import Table from "../../../components/Table";
import TableHead from "../../../components/TableHead";
import TableBody from "../../../components/TableBody";
import TableRow from "../../../components/TableRow";
import TableCell from "../../../components/TableCell";

import { getBoardByName } from "../../../services/boards";
import { getArticles } from "../../../services/articles";

const BoardPage: NextPage = () => {
  const router = useRouter();

  const { name } = router.query as { name: string };

  const boardQuery = useQuery(["board", name], () => getBoardByName(name), {
    enabled: !!name,
  });

  const articlesQuery = useQuery(
    ["articles", boardQuery.data?.name],
    () =>
      getArticles({
        boardName: boardQuery.data?.name,
      }),
    {
      enabled: boardQuery.isSuccess,
    },
  );

  if (boardQuery.status !== "success" || articlesQuery.status !== "success") {
    return <></>;
  }

  const board = boardQuery.data;
  const articles = articlesQuery.data;

  const handleNewArticle = async () => {
    router.push(`/boards/${board.name}/write`);
  };

  const dateTimeFormat = new Intl.DateTimeFormat("ko", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  return (
    <>
      <Layout>
        <Head>
          <title>{`${board.title}`}</title>
        </Head>

        <div className="wrapper">
          <h1>{board.title}</h1>
          <p>{board.description}</p>

          <button className="" onClick={handleNewArticle}>
            글쓰기
          </button>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell>작성자</TableCell>
                <TableCell>작성 날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.items.map((article) => {
                return (
                  <TableRow key={article.id}>
                    <TableCell>
                      <Link href={`/articles/${article.id}`}>
                        {article.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/users/${article.author?.username}`}>
                        {article.author?.username}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {dateTimeFormat.format(Date.parse(article.createdAt))}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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

export default BoardPage;
