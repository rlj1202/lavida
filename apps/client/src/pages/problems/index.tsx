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

import Layout from "../../components/Layout";
import { PaginationResponse } from "../../schemas/pagination-response";
import { Problem } from "../../schemas/problem";
import { getProblems } from "../../services/problems";

import Config from "../../config";
import { getUserProblems } from "../../services/user-problems";
import { UserProblem } from "../../schemas/user-problem";
import { useAppSelector } from "../../store/hooks";
import ProblemTag from "../../components/ProblemTag";

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

        <table className="problems">
          <thead>
            <tr>
              <td>번호</td>
              <td>제목</td>
              <td>정보</td>
              <td>맞힌 사람</td>
              <td>제출</td>
              <td>정답 비율</td>
            </tr>
          </thead>
          <tbody>
            {problems?.items.map((problem) => {
              const userProblem = userProblemsQuery.data?.find(
                (userProblem) => userProblem.problemId === problem.id
              );

              return (
                <tr key={problem.id}>
                  <td>{problem.id}</td>
                  <td>
                    <Link href={`/problems/${problem.id}`}>
                      {problem.title}
                    </Link>
                  </td>
                  <td>
                    {userProblem?.solved === true && (
                      <ProblemTag type="success" />
                    )}
                    {userProblem?.solved === false && (
                      <ProblemTag type="wrong-answer" />
                    )}
                  </td>
                  <td>{problem.acceptCount}</td>
                  <td>{problem.submissionCount}</td>
                  <td>
                    {problem.submissionCount > 0
                      ? (problem.acceptCount / problem.submissionCount).toFixed(
                          2
                        )
                      : 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

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
        .problems {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .problems,
        .problems tr,
        .problems td {
          border: 1px solid #dddddd;
        }
        .problems thead {
          font-weight: bold;
        }
        .problems td {
          padding: 0.4rem;
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
