import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import dateFormat from 'dateformat';

import fetcher from '../../src/libs/fetcher';

import Topbar from '../../components/topbar';
import Footer from '../../components/footer';

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
        <h2>{board?.description ?? 'no description'}</h2>

        <div className="toolbar">
          <span className="toolbar-button newpost">
            <Link href="/"><a>새 글 쓰기</a></Link>
          </span>
          <div className="toolbar-search">
            <input className="toolbar-searchinput" />
            <span className="toolbar-searchbutton">
              검색
            </span>
          </div>
        </div>

        {posts && posts.map((post: IPost, index) => {
          return (
            <div key={index} className="post">
              <div className="post-main">
                <div className="post-title">
                  <Link href={`/post/${post.id}`}><a>{post.title}</a></Link>
                </div>
                <div className="post-content">{post.content}</div>
              </div>
              <div className="post-likes">
                좋아요 수: 0
              </div>
              <div className="post-comments">
                댓글 수: 0
              </div>
              <div className="post-info">
                <div className="post-author">{post.author?.authId}</div>
                <div className="post-date">{dateFormat(post.createdAt)}</div>
              </div>
            </div>
          );
        })}

        <div className="paginator-wrapper">
          <div className="paginator">
            <div className="paginator-cell prev">prev</div>
            <div className="paginator-cell">1</div>
            <div className="paginator-cell">2</div>
            <div className="paginator-cell">3</div>
            <div className="paginator-cell">4</div>
            <div className="paginator-cell next">next</div>
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .wrapper {
          padding: 0 40px;
          max-width: 1000px;
          margin: 50px auto;
        }

        .toolbar {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        .toolbar-search {
          border-radius: 5px;
          border: 1px solid #dddddd;
          font-size: 13px;
          overflow: hidden;
          display: flex;
        }
        .toolbar-searchinput {
          display: block;
          border: none;
          padding: 5px;
        }
        .toolbar-searchbutton {
          padding: 5px 20px;
          border-left: 1px solid #dddddd
        }
        .toolbar-button {
          border-radius: 5px;
          border: 1px solid #dddddd;
          padding: 5px 20px;
          font-size: 13px;
        }
        .toolbar-button.newpost {
          background-color: var(--ansi-green);
          color: white;
        }

        .paginator-wrapper {
          display: flex;
          justify-content: center;
        }
        .paginator {
          border-radius: 5px;
          border: 1px solid #dddddd;
          display: flex;
        }
        .paginator-cell {
          padding: 5px 15px;
          border-right: 1px solid #dddddd;
        }
        .paginator-cell:last-child {
          border-right: none;
        }

        .post {
          padding: 15px 20px;
          border: 1px solid #dddddd;
          border-radius: 5px;
          margin: 20px 0;
          display: flex;
          align-items: center;
        }
        .post-main {
          flex: 1;
        }
        .post-comments, .post-likes, .post-info {
          margin: 0 20px;
          font-size: 0.8rem;
        }
        .post-title {
          font-size: 1.2rem;
          margin-bottom: 10px;
          font-weight: bold;
        }
        .post-content {
          font-size: 0.8rem;
        }
      `}</style>
    </>
  );
}