import Head from 'next/head';
import Link from 'next/link';

import DefaultLayout from '../../layouts/DeaultLayout';

import useSWR from 'swr';
import fetcher from '../../src/libs/fetcher';
import IBoard from '../../src/interfaces/IBoard';

export default function BoardMain() {
  const { data, error } = useSWR('/api/boards', fetcher);
  const boards = data as IBoard[];

  return (
    <DefaultLayout>
      <Head>
        <title>포럼</title>
      </Head>

      <h1>포럼</h1>
      <div className="boards">
        {boards && boards.map(board => (
          <div className="board">
            <div className="board-title">
              <Link href={`/board/${board.name}`}><a>{board.title}</a></Link>
            </div>
            <div className="board-description">
              {board.description}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .boards {
          border: 1px solid #dddddd;
          border-radius: 5px;
        }
        .board {
          padding: 10px;
          border-bottom: 1px solid #dddddd;
        }
        .board:last-child {
          border-bottom: none;
        }
        .board-title {
          font-weight: bold;
          font-size: 1rem;
          margin-bottom: 5px;
        }
        .board-description {
          font-size: 0.9rem;
        }
      `}</style>
    </DefaultLayout>
  );
};