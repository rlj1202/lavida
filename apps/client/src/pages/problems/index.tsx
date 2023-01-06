import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery } from "react-query";
import Layout from "../../components/Layout";
import Config from "../../config";
import { PaginationResponse } from "../../schemas/pagination-response";
import { Problem } from "../../schemas/problem";
import { getProblems } from "../../services/problems";

const Problems: NextPage = () => {
  const router = useRouter();

  const { offset, limit } = router.query;

  if (offset && typeof offset !== "string") throw new Error();
  if (limit && typeof limit !== "string") throw new Error();

  const [pages, setPages] = useState(0);

  const query = useQuery<PaginationResponse<Problem>>(
    ["problems"],
    () => getProblems({ offset, limit }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setPages(Math.ceil(data.total / data.limit));
      },
    }
  );
  const problems = query.data;

  return (
    <>
      <Head>
        <title>{`${Config.title} - Problems`}</title>
      </Head>

      <Layout>
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
              return (
                <tr key={problem.id}>
                  <td>{problem.id}</td>
                  <td>
                    <Link href={`/problems/${problem.id}`}>
                      {problem.title}
                    </Link>
                  </td>
                  <td></td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {Array.from(new Array(pages + 1).keys())
          .slice(1)
          .map((i) => {
            return (
              <div key={i} className="pagination">
                {i}
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
      `}</style>
    </>
  );
};

export default Problems;
