import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';

import fetcher from '../../src/libs/fetcher';

import Topbar from '../../components/topbar';
import IPost from '../../src/interfaces/IPost';
import IBoard from '../../src/interfaces/IBoard';

export const getServerSideProps: GetServerSideProps = async (context) => {
  // var { bname } = context.query;

  return {
    props: {
    }
  };
};

export default function Board({ }) {
  const router = useRouter();
  const { bname } = router.query;

  const board = (() => {
    const { data, error } = useSWR(`/api/boards/${bname}`, fetcher);
    return data as IBoard;
  })();

  const posts = (() => {
    const { data, error } = useSWR(`/api/boards/${bname}/posts?page=0`, fetcher);
    return data as IPost[];
  })();

  return (
    <>
      <Head>
        <title>{board?.title ?? bname}</title>
      </Head>

      <Topbar />

      <div className="wrapper">
        <h1>{board?.title ?? bname}</h1>
        {board?.description ?? 'no description'}
        {posts && posts.map((post: { title: string, content: string }, index) => {
          return (
            <div key={index}>
              <h2>{post.title}</h2>
              {post.content}
            </div>
          );
        })}
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
}