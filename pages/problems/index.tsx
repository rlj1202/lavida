import Link from 'next/link';

import DefaultLayout from '../../layouts/DeaultLayout';

import useSWR from 'swr';

import fetcher from '../../src/libs/fetcher';

import IProblem from '../../src/interfaces/IProblem';

export default function Problems() {
  const problems = (function () {
    var { data, error } = useSWR(`/api/problems`, fetcher);
    return data as IProblem[];
  })();

  return (
    <DefaultLayout>
      <h1>문제</h1>

      <div className="table-wrapper">
        <div className="row row-head">
          <div className="col">순번</div>
          <div className="col">제목</div>
          <div className="col">좋아요</div>
          <div className="col">작성자</div>
        </div>

        {problems && problems.map(problem => {
          return (
            <div className="row">
              <div className="col">{problem?.id}</div>
              <div className="col">
                <Link href={`/problems/${problem.id}`}><a>{problem?.title}</a></Link>
              </div>
              <div className="col">0</div>
              <div className="col">{problem?.author?.name}</div>
            </div>
          );
        })}

      </div>

      <style jsx>{`
      .table-wrapper {
        border: 1px solid #dddddd;
        border-radius: 5px;
        margin: 20px 0;
        font-size: 0.9rem;
      }
      .row {
        padding: 10px 0;
        border-bottom: 1px solid #dddddd;
        display: flex;
        flex-direction: row;
      }
      .row:last-child {
        border-bottom: none;
      }
      .row-head {
        font-weight: bold;
      }
      .col {
        padding: 0 10px;
        text-align: center;
      }
      .col:nth-child(1) {
        width: 10%;
      }
      .col:nth-child(2) {
        width: 70%;
        text-align: left;
      }
      .col:nth-child(3) {
        width: 10%;
      }
      .col:nth-child(4) {
        width: 10%;
      }
      `}</style>
    </DefaultLayout>
  );
}