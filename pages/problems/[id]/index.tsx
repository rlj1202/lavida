import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import DefaultLayout from '../../../layouts/DeaultLayout';

import useSWR from 'swr';

import fetcher from '../../../src/libs/fetcher';

import IProblem from '../../../src/interfaces/IProblem';

export default function Problem() {
  const router = useRouter();
  const { id } = router.query;

  const problem = (function () {
    const { data, error } = useSWR(`/api/problems/${id}`, fetcher);
    return data as IProblem;
  })();

  return (
    <DefaultLayout>
      <Head>
        <title>{problem?.title ?? ''}</title>
      </Head>

      <h1>
        <span className="problem-id">#{problem?.id}</span>
        <span className="problem-title">{problem?.title}</span>
      </h1>

      <div className="toolbar">
        <div className="toolbar-button submit">
          <Link href={`/problems/${problem?.id}/submit`}><a>제출하기</a></Link>
        </div>
        <div className="toolbar-button status">
          <Link href="/"><a>상태</a></Link>
        </div>
        <div className="toolbar-button discuss">
          <Link href="/"><a>토론</a></Link>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <td>시간 제한</td>
            <td>메모리 제한</td>
            <td>제출 횟수</td>
            <td>맞은 횟수</td>
            <td>작성자</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{problem?.timeLimit} ms</td>
            <td>{problem?.memoryLimit} bytes</td>
            <td>0</td>
            <td>0</td>
            <td>{problem?.author?.name}</td>
          </tr>
        </tbody>
      </table>

      <h2>설명</h2>
      <p>
        {problem?.description}
      </p>
      
      <h2>입력</h2>
      <p>

      </p>

      <h2>출력</h2>
      <p>

      </p>

      <h2>예제</h2>
      <p>

      </p>

      <style jsx>{`
      .table {
        width: 100%;
        text-align: center;
        border: 1px solid #dddddd;
        border-radius: 5px;
        font-size: 0.9rem;
      }
      .table thead tr {
        font-weight: bold;
      }

      .problem-title {
        margin-left: 10px;
      }

      .toolbar {
        margin: 10px 0;
      }
      .toolbar-button {
        border: 1px solid #dddddd;
        border-radius: 5px;
        font-size: 0.9rem;
        padding: 5px 20px;
        display: inline-block;
        margin-right: 5px;
      }
      .toolbar-button.submit {
        background-color: var(--ansi-cyan);
        color: white;
      }
      .toolbar-button.status {
        background-color: var(--ansi-yellow);
        color: white;
      }
      .toolbar-button.discuss {
        background-color: var(--ansi-green);
        color: white;
      }
      `}</style>
    </DefaultLayout>
  );
}