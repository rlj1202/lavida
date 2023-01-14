import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { useQuery } from "react-query";

import Layout from "../../../components/Layout";
import { getUser } from "../../../services/users";

import Config from "../../../config";
import Link from "next/link";

interface Params extends ParsedUrlQuery {
  username: string;
}

interface Props {
  username: string;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const username = context.params?.username;

  if (!username) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      username,
    },
  };
};

const UserPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ username }) => {
  const query = useQuery(["user", username], () => getUser(username));

  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - ${username}`}</title>
        </Head>

        <h1>유저 정보</h1>

        <table className="info">
          <tbody>
            <tr>
              <td>유저네임</td>
              <td>{query.data?.username}</td>
            </tr>
            <tr>
              <td>이메일</td>
              <td>{query.data?.email}</td>
            </tr>
            <tr>
              <td>총 제출 수</td>
              <td>{query.data?.submissionCount}</td>
            </tr>
            <tr>
              <td>맞은 수</td>
              <td>{query.data?.acceptCount}</td>
            </tr>
            <tr>
              <td>푼 문제 수</td>
              <td>
                {
                  query.data?.problems.filter((problem) => problem.solved)
                    .length
                }
              </td>
            </tr>
          </tbody>
        </table>

        <h2>푼 문제</h2>
        <div>
          {query.data?.problems
            .filter((problem) => problem.solved)
            .map((problem) => {
              return (
                <span key={problem.problemId} className="problem">
                  <Link href={`/problems/${problem.problemId}`}>
                    {problem.problemId}
                  </Link>
                </span>
              );
            })}
        </div>

        <h2>풀지 못한 문제</h2>
        <div>
          {query.data?.problems
            .filter((problem) => !problem.solved)
            .map((problem) => {
              return (
                <span key={problem.problemId} className="problem">
                  <Link href={`/problems/${problem.problemId}`}>
                    {problem.problemId}
                  </Link>
                </span>
              );
            })}
        </div>
      </Layout>

      <style jsx>{`
        .info {
          border-collapse: collapse;
          width: 30%;
          table-layout: fixed;
          font-size: 0.9rem;
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .info,
        .info td {
          border: 1px solid #dddddd;
        }
        .info td {
          padding: 0.4rem;
        }
        .info td:first-child {
          font-weight: bold;
        }

        h1,
        h2 {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .problem {
          margin-right: 0.4rem;
        }
      `}</style>
    </>
  );
};

export default UserPage;
