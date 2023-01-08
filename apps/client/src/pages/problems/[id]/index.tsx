import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useQuery } from "react-query";
import convert from "convert-units";

import Layout from "apps/client/src/components/Layout";
import { Problem } from "apps/client/src/schemas/problem";
import { getProblem } from "apps/client/src/services/problems";

import Config from "../../../config";
import { UserProblem } from "apps/client/src/schemas/user-problem";
import { useAppSelector } from "apps/client/src/store/hooks";
import { getUserProblems } from "apps/client/src/services/user-problems";
import ProblemTag from "apps/client/src/components/ProblemTag";

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

  const userId = useAppSelector((store) => store.auth.user?.id);

  const problemQuery = useQuery<Problem>(["problem", problemId], () =>
    getProblem(problemId)
  );
  const problem = problemQuery.data;

  const userProblemsQuery = useQuery<UserProblem[]>(
    ["user-problems", userId],
    () => (userId ? getUserProblems(userId) : [])
  );

  function unitToString(data: { val: number; unit: string }) {
    return `${data.val} ${data.unit}`;
  }

  const handleCopy = (value: string | undefined | null) => {
    if (!value) return;

    navigator.clipboard.writeText(value);
  };

  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - ${problem?.title}`}</title>
        </Head>

        <h1>{problem?.title}</h1>
        {userProblemsQuery.data?.find((item) => item.problemId === problem?.id)
          ?.solved === true && <ProblemTag type="success" />}
        {userProblemsQuery.data?.find((item) => item.problemId === problem?.id)
          ?.solved === false && <ProblemTag type="wrong-answer" />}
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
              <td>
                {unitToString(convert(problem?.timeLimit).from("ms").toBest())}
              </td>
              <td>
                {unitToString(convert(problem?.memoryLimit).from("b").toBest())}
              </td>
              <td>{problem?.acceptCount}</td>
              <td>{problem?.submissionCount}</td>
              <td>
                {problemQuery.isSuccess && problemQuery.data.submissionCount > 0
                  ? (
                      problemQuery.data.acceptCount /
                      problemQuery.data.submissionCount
                    ).toFixed(2)
                  : 0}
              </td>
            </tr>
          </tbody>
        </table>
        <h2>설명</h2>
        <p dangerouslySetInnerHTML={{ __html: problem?.description || "" }}></p>
        <h2>입력</h2>
        <p dangerouslySetInnerHTML={{ __html: problem?.inputDesc || "" }}></p>
        <h2>출력</h2>
        <p dangerouslySetInnerHTML={{ __html: problem?.outputDesc || "" }}></p>
        {problem?.samples &&
          problem.samples.map((sample, i) => {
            return (
              <>
                <h2>예제 입력 {i + 1}</h2>
                <button onClick={() => handleCopy(sample.input)}>복사</button>
                <pre className="sample">
                  <code>{sample.input}</code>
                </pre>
                <h2>예제 출력 {i + 1}</h2>
                <button onClick={() => handleCopy(sample.output)}>복사</button>
                <pre className="sample">
                  <code>{sample.output}</code>
                </pre>
              </>
            );
          })}
        {problem?.hint && (
          <>
            <h2>힌트</h2>
            <p dangerouslySetInnerHTML={{ __html: problem?.hint || "" }}></p>
          </>
        )}
        {problem?.source && (
          <>
            <h2>출처</h2>
            <p>{problem?.source}</p>
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
        h2,
        .sample {
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
        .sample {
          border: 1px solid #dddddd;
          background-color: #efefef;
          padding: 0.5rem;
        }
      `}</style>
    </>
  );
};

export default Problem;
