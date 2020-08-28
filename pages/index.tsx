import Head from 'next/head';
import Link from 'next/link';

import { Request } from 'express';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  var session = (context.req as Request).session;

  return {
    props: {
      id: session?.userId ? session.userId : null,
      name: session?.userName ? session.userName : null
    }
  }
}

export default function Home({
  id, name
}: {
  id?: string
  name?: string
}) {
  return (
    <>
      <Head>
        <title>Lavida</title>
      </Head>
      
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-logo">
            <Link href="/"><a>{ '{ Lavida }' }</a></Link>
          </div>
          <div className="topbar-pagelink"><Link href="/"><a>FAQ</a></Link></div>
          <div className="topbar-pagelink"><Link href="/board"><a>Forum</a></Link></div>
          <div className="topbar-pagelink"><Link href="/"><a>Problems</a></Link></div>
          <div className="topbar-pagelink"><Link href="/"><a>Status</a></Link></div>
          <div className="topbar-pagelink"><Link href="/"><a>Contest</a></Link></div>
          <div className="topbar-pagelink"><Link href="/"><a>Tools</a></Link></div>
        </div>
        <div className="topbar-right">
          <div className="topbar-buttons">
            { !id && <>
              <span className="topbar-button login">
                <Link href="/login"><a>로그인</a></Link>
              </span>
              <span className="topbar-button register">
                <Link href="/register"><a>회원가입</a></Link>
              </span>
            </> }
            { id && <>
              <span>
                { id + ':' + name }
              </span>
              <span className="topbar-button">
                <Link href="/"><a>내 정보</a></Link>
              </span>
              <span className="topbar-button logout">
                <Link href="/auth/signout"><a>로그아웃</a></Link>
              </span>
            </> }
          </div>
        </div>
      </div>

      <div className="boards">
        <div className="board">
          <h1><Link href="/board/notice"><a>공지사항</a></Link></h1>
          <article className="notice">
            <h2>제목</h2>
            <div>
              여기에 내용을 적어주세요.
            </div>
          </article>
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

      <footer className="footer">
        Copyright (c) 2020 rlj1202@gmail.com<br />
        Ajou University
      </footer>

      <style jsx>{`
          .topbar {
          font-family: 'NanumSquare', sans-serif;
          border-bottom: 1px solid #dddddd;

          padding: 20px 40px;

          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
        .topbar-left {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .topbar-pagelink {
          margin: 0 10px;
        }
        .topbar-logo {
          font-size: 30px;
          font-weight: bold;

          margin-right: 20px;
        }
        .topbar-button {
          font-size: 13px;
          border-radius: 5px;
          border: 1px solid #dddddd;

          padding: 5px 20px;
          margin-left: 10px;
        }
        .topbar-button.login {
          background-color: var(--ansi-red);
          color: white;
        }

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

        .footer {
          padding: 20px 40px;
          text-align: center;
          font-size: 10px;
        }
      `}</style>
    </>
  );
};
