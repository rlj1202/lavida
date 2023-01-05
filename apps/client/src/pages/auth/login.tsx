import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent } from "react";

import Layout from "../../components/Layout";
import { login } from "../../services/auth";

const Login: NextPage = () => {
  const router = useRouter();

  const handleSubmit = async (
    event: FormEvent<
      HTMLFormElement & {
        username: HTMLInputElement;
        password: HTMLInputElement;
      }
    >
  ) => {
    event.preventDefault();

    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;

    await login({ username, password });

    if (router.query.from && typeof router.query.from === "string") {
      router.push(router.query.from);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>{"로그인"}</title>
      </Head>

      <Layout>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="유저네임"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호"
            pattern="[a-zA-Z0-9]{3,20}"
            title="Password should be digits (0 to 9) or alphabets (a to z)."
          />

          <button type="submit">로그인</button>
        </form>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default Login;
