import Head from 'next/head';
import Link from 'next/link';

import Topbar from '../../components/topbar';

import useSWR from 'swr';
import fetcher from '../../src/libs/fetcher';
import IBoard from '../../src/interfaces/IBoard';

export default function BoardMain() {
  const { data, error } = useSWR('/api/boards', fetcher);
  const boards = data as IBoard[];

  return (
    <>
      <Head>
        <title>포럼</title>
      </Head>

      <Topbar />

      <div className="wrapper">
        <h1>포럼</h1>
        { boards && boards.map(board => (
          <>
            <h2><Link href={`/board/${board.name}`}><a>{ board.title }</a></Link></h2>
          </>
        )) }
      </div>

      <style jsx>{`
        .wrapper {
          padding: 0 40px;
          max-width: 1000px;
          margin: 50px auto;
        }
      `}</style>
    </>
  );
};