import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Layout from "../../components/Layout";
import Config from "../../config";
import { Problem } from "../../schemas/problem";
import { getProblems } from "../../services/problems";

const Problems: NextPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  useState(() => {
    async function fetch() {
      setProblems(await getProblems());
    }

    fetch();
  });

  return (
    <>
      <Head>
        <title>{`${Config.title} - Problems`}</title>
      </Head>

      <Layout>
        <h1>Problems</h1>

        {problems.map((problem) => {
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
