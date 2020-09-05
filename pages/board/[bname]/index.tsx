import { useState, SetStateAction, Dispatch } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';
import dateFormat from 'dateformat';

import fetcher from '../../../src/libs/fetcher';

import Topbar from '../../../components/topbar';
import Footer from '../../../components/footer';

import IPost from '../../../src/interfaces/IPost';
import IBoard from '../../../src/interfaces/IBoard';
import IPagination from '../../../src/interfaces/IPagination';

function Paginator({ pages, setPage }: { pages: number, setPage: Dispatch<SetStateAction<number>>}) {
  return (
    <div className="paginator-wrapper">
      <div className="paginator">
        <div className="paginator-cell prev">prev</div>
        {(() => {
          var results = [];
          for (var i = 0; i < pages; i++) {
            results.push((
              <div className="paginator-cell" onClick={((i) => () => setPage(i))(i)}>
                {i + 1}
              </div>
            ));
          }
          return results;
        })()}
        <div className="paginator-cell next">next</div>
      </div>

      <style jsx>{`
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
      `}</style>
    </div>
  );
}

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
    return data as (IBoard | null | undefined);
  })();

  var [page, setPage] = useState(0);

  function usePosts(page: number) {
    const { data, error } = useSWR(`/api/boards/${bname}/posts?page=${page}`, fetcher);
    return data as (IPagination<IPost> | null | undefined);
  }

  var posts = usePosts(page);

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
            <Link href={`/board/${bname}/create`}><a>새 글 쓰기</a></Link>
          </span>
          <div className="toolbar-search">
            <input className="toolbar-searchinput" />
            <span className="toolbar-searchbutton">
              검색
            </span>
          </div>
        </div>

        <Paginator pages={posts ? Math.ceil(posts?.total / posts?.limit) : 0} setPage={setPage} />

        <div className="posts">
          {posts && posts.items?.map((post: IPost, index) => {
            return (
              <div key={index} className="post">
                <div className="post-main">
                  <div className="post-tags">
                    <span className="tag category">{board?.title}</span>
                    <span className="tag">테스트</span>
                  </div>
                  <div className="post-title">
                    <Link href={`/post/${post.id}`}><a>{post.title}</a></Link>
                  </div>
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
        </div>

        <Paginator pages={posts ? Math.ceil(posts?.total / posts?.limit) : 0} setPage={setPage} />
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

        .posts {
          border: 1px solid #dddddd;
          border-radius: 5px;
          margin: 20px 0;
        }
        .post {
          padding: 10px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #dddddd;
        }
        .post-tags {
          margin-bottom: 5px;
        }
        .post-tags .tag {
          border-radius: 5px;
          padding: 1px 4px;
          border: 1px solid #dddddd;
          margin-right: 5px;
          font-size: 0.7rem;
        }
        .post-tags .tag.category {
          background-color: var(--ansi-cyan);
          color: white;
        }
        .post:last-child {
          border-bottom: none;
        }
        .post-main {
          flex: 1;
          font-size: 0.8rem;
        }
        .post-comments, .post-likes, .post-info {
          margin-left: 20px;
          font-size: 0.7rem;
        }
        .post-title {
          font-size: 0.9rem;
          font-weight: bold;
        }
        .post-content {
          font-size: 0.8rem;
        }
      `}</style>
    </>
  );
}