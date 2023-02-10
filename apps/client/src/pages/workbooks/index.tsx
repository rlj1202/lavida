import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableBody from "../../components/TableBody";
import TableCell from "../../components/TableCell";
import TableHead from "../../components/TableHead";
import TableRow from "../../components/TableRow";

import { getWorkbooks } from "../../services/workbooks";

const WorkbooksPage: NextPage = () => {
  const query = useQuery(["workbooks"], () => getWorkbooks());

  if (query.status !== "success") {
    return <></>;
  }

  const workbooks = query.data;

  return (
    <>
      <Layout>
        <Head>
          <title>{`문제집`}</title>
        </Head>

        <div className="wrapper">
          <h1>Workbooks</h1>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>문제수</TableCell>
                <TableCell>만든이</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workbooks.items.map((item) => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <Link href={`/workbooks/${item.id}`}>{item.title}</Link>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <Link href={`/users/${item.author.username}`}>
                        {item.author.username}
                      </Link>
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

export default WorkbooksPage;
