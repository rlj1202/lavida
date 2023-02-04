import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent } from "react";

import Layout from "../../components/Layout";
import { register } from "../../services/auth";

const Register: NextPage = () => {
  const router = useRouter();

  const handleSubmit = async (
    event: FormEvent<
      HTMLFormElement & {
        username: HTMLInputElement;
        email: HTMLInputElement;
        password: HTMLInputElement;
        passwordCheck: HTMLInputElement;
      }
    >
  ) => {
    event.preventDefault();

    const username = event.currentTarget.username.value;
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    const passwordCheck = event.currentTarget.passwordCheck.value;

    if (password !== passwordCheck) {
      alert("Password and password confirmation field does not match");
      return;
    }

    await register({ username, email, password });

    if (router.query.from && typeof router.query.from === "string") {
      router.push(router.query.from);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Layout>
        <Head>
          <title>{"회원가입"}</title>
        </Head>

        <div className="wrapper">
          <h1>회원가입</h1>

          <form className="form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text" />
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" />
            </div>

            <div>
              <label htmlFor="passwordCheck">Password Check</label>
              <input id="passwordCheck" name="passwordCheck" type="password" />
            </div>

            <button type="submit">등록하기</button>
          </form>
        </div>
      </Layout>

      <style jsx>{`
        .wrapper > * {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .form {
        }
      `}</style>
    </>
  );
};
export default Register;
