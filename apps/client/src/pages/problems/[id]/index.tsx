import Layout from "apps/client/src/components/Layout";
import { Problem } from "apps/client/src/schemas/problem";
import { getProblem } from "apps/client/src/services/problems";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useQuery } from "react-query";
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
  const router = useRouter();

  const query = useQuery<Problem>(["problem", problemId], () =>
    getProblem(problemId)
  );
  const problem = query.data;

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

        <button onClick={() => router.push(`/submit/${problem?.id}`)}>
          제출하기
        </button>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default Problem;
