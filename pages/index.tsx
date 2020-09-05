import Head from 'next/head';
import Link from 'next/link';

import { Request } from 'express';
import { GetServerSideProps } from 'next';

import Topbar from '../components/topbar';
import Footer from '../components/footer';
import Posts from '../components/posts';

import useSWR from 'swr';
import fetcher from '../src/libs/fetcher';

import IBoard from '../src/interfaces/IBoard';
import IPost from '../src/interfaces/IPost';
import IPagination from '../src/interfaces/IPagination';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // var session = (context.req as Request).session;

  return {
    props: {
    }
  }
}

export default function Home({}) {
  var board = (() => {
    var { data, error } = useSWR(`/api/boards/notice`, fetcher);
    return data as IBoard;
  })();
  var posts = (() => {
    var { data, error } = useSWR(`/api/boards/notice/posts?page=0&per_page=5`, fetcher);
    return data as IPagination<IPost>;
  })();

  return (
    <>
      <Head>
        <title>Lavida</title>
      </Head>
      
      <Topbar />

      <div className="boards">
        <div className="board">
          <h1><Link href="/board/notice"><a>공지사항</a></Link></h1>
          <Posts board={board} posts={posts?.items} />
        </div>
        <div className="board">
          <h1>새로운 문제</h1>
          <ul>
            <li>1000 - 이런식으로</li>
            <li>1001 - 문제가</li>
            <li>1002 - 있을</li>
            <li>1003 - 예정</li>
          </ul>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .boards {
          padding: 0 40px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .board h1 {
          font-size: 34px;
        }
        .board {
          margin: 50px 0;
        }
      `}</style>
    </>
  );
};
