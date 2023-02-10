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
import Config from "../../config";

import { getContests } from "../../services/contests";

const Contests: NextPage = () => {
  const query = useQuery(["contests"], async () => getContests());

  if (query.status !== "success") {
    return <></>;
  }

  const contests = query.data;

  const dateTimeFormat = new Intl.DateTimeFormat("ko", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Contests`}</title>
        </Head>

        <div className="wrapper">
          <h1>Contests</h1>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>우승</TableCell>
                <TableCell>준우승</TableCell>
                <TableCell>시작일</TableCell>
                <TableCell>종료일</TableCell>
                <TableCell>상태</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contests.items.map((contest) => {
                return (
                  <TableRow key={contest.id}>
                    <TableCell>{contest.id}</TableCell>
                    <TableCell>
                      <Link href={`/contests/${contest.id}`}>
                        {contest.title}
                      </Link>
                    </TableCell>
                    <TableCell>철수</TableCell>
                    <TableCell>영희</TableCell>
                    <TableCell>
                      {dateTimeFormat.format(Date.parse(contest.startAt))}
                    </TableCell>
                    <TableCell>
                      {dateTimeFormat.format(Date.parse(contest.endAt))}
                    </TableCell>
                    <TableCell>종료</TableCell>
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

export default Contests;
