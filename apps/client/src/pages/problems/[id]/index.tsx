import Layout from "apps/client/src/components/Layout";
import { Problem } from "apps/client/src/schemas/problem";
import { getProblem } from "apps/client/src/services/problems";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { useState } from "react";
import Config from "../../../config";

interface Params extends ParsedUrlQuery {
  id: string;
}

interface Props {
  problemId: number;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const id = context.params?.id;

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      problemId: parseInt(id, 10),
    },
  };
};

const Problem: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ problemId }) => {
  const [problem, setProblem] = useState<Problem>();

  useState(() => {
    async function fetch() {
      setProblem(await getProblem(problemId));
    }

    fetch();
  });

  return (
    <>
      <Head>
        <title>{`${Config.title}`}</title>
      </Head>

      <Layout>
        <h1>{problem?.title}</h1>
        <div>{problem?.description}</div>
        <div>{problem?.inputDesc}</div>
        <div>{problem?.outputDesc}</div>
        <div>{problem?.hint}</div>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default Problem;
