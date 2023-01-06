import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { FormEvent } from "react";
import { useQuery } from "react-query";

import Layout from "../../components/Layout";
import { getProblem } from "../../services/problems";
import { submit } from "../../services/submissions";

interface Params extends ParsedUrlQuery {
  problemId: string;
}

interface Props {
  problemId: number;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const { problemId: problemIdStr } = context.params || {};

  if (!problemIdStr) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      problemId: parseInt(problemIdStr, 10),
    },
  };
};

const Submit: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ problemId }) => {
  const router = useRouter();

  const queryKey = ["problem", problemId];
  const query = useQuery(queryKey, () => getProblem(problemId), {
    refetchOnWindowFocus: false,
  });
  const { data: problem } = query;

  const handleSubmit = async (
    event: FormEvent<
      HTMLFormElement & {
        language: HTMLSelectElement;
        code: HTMLTextAreaElement;
      }
    >
  ) => {
    event.preventDefault();

    const language = event.currentTarget.language.value;
    const code = event.currentTarget.code.value;

    await submit({ problemId, language, code });

    router.push({
      pathname: "/status",
      query: {},
    });
  };

  return (
    <>
      <Layout>
        <Head>
          <title>{`${problem?.id}번 제출`}</title>
        </Head>

        <h1>{problem?.title}</h1>
        <div>문제 번호: {problem?.id}</div>

        <form className="" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="language">언어</label>
            <select id="language" name="language">
              <option value="C++11">C++11</option>
              <option value="Python3">Python3</option>
            </select>
          </div>
          <div>
            <label htmlFor="code">소스 코드</label>
            <textarea
              id="code"
              name="code"
              placeholder="여기에 코드를 작성하세요"
              className="code"
            ></textarea>
          </div>
          <button type="submit">제출</button>
        </form>
      </Layout>

      <style jsx>{`
        h1 {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .code {
          display: block;
          width: 100%;
          min-height: 10rem;
        }
      `}</style>
    </>
  );
};

export default Submit;
