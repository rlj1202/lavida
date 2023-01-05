import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { logout } from "../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Container from "./Container";

const Topbar: React.FC = () => {
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

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
          {user ? (
            <>
              <button className="button" onClick={() => dispatch(logout())}>
                로그아웃
              </button>
              <span>{user.email}</span>
            </>
          ) : (
            <>
              <button
                className="button"
                onClick={() =>
                  router.push({
                    pathname: "/auth/login",
                    query: { from: router.pathname },
                  })
                }
              >
                로그인
              </button>
              <button className="button" onClick={() => {}}>
                회원가입
              </button>
            </>
          )}
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
