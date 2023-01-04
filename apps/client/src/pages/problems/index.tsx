import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "react-query";
import Layout from "../../components/Layout";
import Config from "../../config";
import { Problem } from "../../schemas/problem";
import { getProblems } from "../../services/problems";

const Problems: NextPage = () => {
  const query = useQuery<Problem[]>(["problems"], () => getProblems());
  const problems = query.data;

  return (
    <>
      <Head>
        <title>{`${Config.title} - Problems`}</title>
      </Head>

      <Layout>
        <h1>Problems</h1>

        {problems?.map((problem) => {
          return (
            <div key={problem.id} className="problem">
              <div>
                <Link href={`/problems/${problem.id}`}>{problem.title}</Link>
              </div>
              <div>{problem.id}</div>
            </div>
          );
        })}
      </Layout>

      <style jsx>{`
        .problem {
        }
      `}</style>
    </>
  );
};

export default Problems;
