import Link from "next/link";
import React from "react";
import Container from "./Container";

const Topbar: React.FC = () => {
  return (
    <div className="wrapper">
      <Container>
        <div className="items">
          <div className="logo">
            <Link href="/">{"{ Lavida }"}</Link>
          </div>
          <div className="pagelink">
            <Link href="/faq">FAQ</Link>
          </div>
          <div className="pagelink">
            <Link href="/boards">Forum</Link>
          </div>
          <div className="pagelink">
            <Link href="/problems">Problems</Link>
          </div>
          <div className="pagelink">
            <Link href="/status">Status</Link>
          </div>
          <div className="pagelink">
            <Link href="/contests">Contests</Link>
          </div>
          <div className="pagelink">
            <Link href="/tools">Tools</Link>
          </div>
          <button className="button">로그인</button>
          <button className="button">회원가입</button>
        </div>
      </Container>

      <style jsx>{`
        .wrapper {
          font-family: "NanumSquare", sans-serif;
          border-bottom: 1px solid #dddddd;
        }
        .items {
          padding: 1rem 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          column-gap: 1rem;
        }
        .logo {
          font-size: 2rem;
          font-weight: bold;
        }
        .button {
          font-size: 0.8rem;
          border-radius: 0.3rem;
          border: 1px solid #dddddd;
          padding: 0.3rem 1rem;
          background-color: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Topbar;