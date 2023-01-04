import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { FormEvent } from "react";
import Layout from "../../components/Layout";
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

    router.push("/status");
  };

  return (
    <>
      <Layout>
        <div>문제 번호: {problemId}</div>

        <form className="" onSubmit={handleSubmit}>
          <select id="language" name="language">
            <option value="C++11">C++11</option>
            <option value="Python3">Python3</option>
          </select>
          <textarea
            id="code"
            name="code"
            placeholder="여기에 코드를 작성하세요"
            className=""
          ></textarea>
          <button type="submit">제출</button>
        </form>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default Submit;
