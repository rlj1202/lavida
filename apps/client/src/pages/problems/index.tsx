import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";

import { PaginationResponse } from "../../schemas/pagination-response";
import { Problem } from "../../schemas/problem";
import { UserProblem } from "../../schemas/user-problem";

import { getProblems } from "../../services/problems";
import { getUserProblems } from "../../services/user-problems";

import { useAppSelector } from "../../store/hooks";

import Layout from "../../components/Layout";
import ProblemTag from "../../components/ProblemTag";
import Table from "../../components/Table";
import TableHead from "../../components/TableHead";
import TableRow from "../../components/TableRow";
import TableCell from "../../components/TableCell";
import TableBody from "../../components/TableBody";

import Config from "../../config";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

const Problems: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({}) => {
  const router = useRouter();

  const { page } = router.query;

  if (page && typeof page !== "string") throw new Error();

  const pageNumber = parseInt(page || "1", 10);
  const limit = 20;
  const offset = (pageNumber - 1) * limit;

  const [pages, setPages] = useState(0);

  const userId = useAppSelector((store) => store.auth.user?.id);

  const problemsQuery = useQuery<PaginationResponse<Problem>>(
    ["problems", page],
    () => getProblems({ offset, limit }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setPages(Math.ceil(data.total / data.limit));
      },
    }
  );
  const problems = problemsQuery.data;

  const userProblemsQuery = useQuery<UserProblem[]>(
    ["user-problems", userId],
    () => (userId ? getUserProblems(userId) : [])
  );

  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Problems`}</title>
        </Head>

        <h1>Problems</h1>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>정보</TableCell>
              <TableCell>맞힌 사람</TableCell>
              <TableCell>제출</TableCell>
              <TableCell>정답 비율</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {problems?.items.map((problem) => {
              const userProblem = userProblemsQuery.data?.find(
                (userProblem) => userProblem.problemId === problem.id
              );

              return (
                <TableRow key={problem.id}>
                  <TableCell>{problem.id}</TableCell>
                  <TableCell>
                    <Link href={`/problems/${problem.id}`}>
                      {problem.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {userProblem?.solved === true && (
                      <ProblemTag type="success" />
                    )}
                    {userProblem?.solved === false && (
                      <ProblemTag type="wrong-answer" />
                    )}
                  </TableCell>
                  <TableCell>{problem.acceptCount}</TableCell>
                  <TableCell>{problem.submissionCount}</TableCell>
                  <TableCell>
                    {problem.submissionCount > 0
                      ? (problem.acceptCount / problem.submissionCount).toFixed(
                          2
                        )
                      : 0}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {Array.from(new Array(pages + 1).keys())
          .slice(1)
          .map((i) => {
            const isActivePage = pageNumber === i;

            const activeClass = isActivePage ? "active" : "";

            return (
              <div key={i} className={`pagination ${activeClass}`}>
                <Link href={`/problems?page=${i}`}>{i}</Link>
              </div>
            );
          })}
      </Layout>

      <style jsx>{`
        h1,
        .problems {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .pagination {
          border: 1px solid #dddddd;
          font-size: 0.9rem;
          padding: 0.4rem 0.8rem;
          display: inline-block;
        }
        .pagination.active {
          background-color: var(--ansi-red);
          color: white;
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default Problems;
