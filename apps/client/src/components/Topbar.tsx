import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { logout } from "../store/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Container from "./Container";

const PageLink: React.FC<{ pathname: string; label: string }> = ({
  pathname,
  label,
}) => {
  const router = useRouter();

  const selected = router.pathname === pathname;

  return (
    <div className="wrapper">
      <Link href={pathname}>
        <span className={`${selected ? "selected" : ""}`}>{label}</span>
      </Link>

      <style jsx>{`
        .wrapper {
        }
        .selected {
          text-decoration: underline;
          text-decoration-color: var(--ansi-red);
          text-decoration-thickness: 0.2rem;
          text-underline-position: under;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

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
          <PageLink pathname="/faq" label="FAQ" />
          <PageLink pathname="/boards" label="Forum" />
          <PageLink pathname="/problems" label="Problems" />
          <PageLink pathname="/status" label="Status" />
          <PageLink pathname="/contests" label="Contests" />
          <PageLink pathname="/ranks" label="Ranks" />
          <PageLink pathname="/tools" label="Tools" />
          <PageLink pathname="/search" label="Search" />
          <div className="authinfo">
            {user ? (
              <>
                <button className="button" onClick={() => dispatch(logout())}>
                  로그아웃
                </button>
                <span>
                  <Link href={`/users/${user.username}`}>{user.email}</Link>
                </span>
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
                <button
                  className="button"
                  onClick={() =>
                    router.push({
                      pathname: "/auth/register",
                      query: { from: router.pathname },
                    })
                  }
                >
                  회원가입
                </button>
              </>
            )}
          </div>
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
          float: left;
        }
        .button {
          font-size: 0.8rem;
          border-radius: 0.3rem;
          border: 1px solid #dddddd;
          padding: 0.3rem 1rem;
          background-color: white;
          cursor: pointer;
        }
        .authinfo {
        }
      `}</style>
    </div>
  );
};

export default Topbar;
