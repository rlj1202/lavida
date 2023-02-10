import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import Layout from "../../../components/Layout";
import Table from "../../../components/Table";
import TableBody from "../../../components/TableBody";
import TableCell from "../../../components/TableCell";
import TableHead from "../../../components/TableHead";
import TableRow from "../../../components/TableRow";

import { getWorkbook } from "../../../services/workbooks";

const WorkbookPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query as { id: string };

  const query = useQuery(["workbook", id], async () => getWorkbook(id), {
    enabled: !!id,
  });

  if (query.status !== "success") {
    return <></>;
  }

  const workbook = query.data;

  return (
    <>
      <Layout>
        <Head>
          <title>{``}</title>
        </Head>

        <div className="wrapper">
          <h1>{workbook.title}</h1>
          <p>{workbook.description}</p>
          <p>
            만든이:{" "}
            <Link href={`/users/${workbook.author.username}`}>
              {workbook.author.username}
            </Link>
          </p>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>맞은 사람</TableCell>
                <TableCell>제출 횟수</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workbook.workbookProblems.map((item) => {
                return (
                  <TableRow key={item.order}>
                    <TableCell>{item.problemId}</TableCell>
                    <TableCell>
                      <Link href={`/problems/${item.problemId}`}>
                        {item.problem.title}
                      </Link>
                    </TableCell>
                    <TableCell>{item.problem.acceptCount}</TableCell>
                    <TableCell>{item.problem.submissionCount}</TableCell>
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

export default WorkbookPage;
