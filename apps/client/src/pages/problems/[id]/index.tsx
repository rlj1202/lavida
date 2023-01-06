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
        <table className="info">
          <thead>
            <tr>
              <td>시간 제한</td>
              <td>메모리 제한</td>
              <td>제출</td>
              <td>맞힌 사람</td>
              <td>정답 비율</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{problem?.timeLimit} ms</td>
              <td>{problem?.memoryLimit} bytes</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>
        <h2>설명</h2>
        <p>{problem?.description}</p>
        <h2>입력</h2>
        <p>{problem?.inputDesc}</p>
        <h2>출력</h2>
        <p>{problem?.outputDesc}</p>
        <h2>예제 입력</h2>
        <div></div>
        <h2>예제 출력</h2>
        <div></div>
        {problem?.hint && (
          <>
            <h2>힌트</h2>
            <p>{problem?.hint}</p>
          </>
        )}

        <button onClick={() => router.push(`/submit/${problem?.id}`)}>
          제출하기
        </button>
      </Layout>

      <style jsx>{`
        p,
        .info,
        h1,
        h2 {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .info,
        .info tr,
        .info td {
          border: 1px solid #dddddd;
        }
        .info {
          border-collapse: collapse;
          width: 100%;
          font-size: 0.9rem;
          table-layout: fixed;
        }
        .info thead {
          font-weight: bold;
        }
        .info td {
          padding: 0.4rem;
        }
      `}</style>
    </>
  );
};

export default Problem;
