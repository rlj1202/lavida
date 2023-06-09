import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent } from 'react';

import Layout from '../../components/Layout';
import { login } from '../../services/auth';

const Login: NextPage = () => {
  const router = useRouter();

  const handleSubmit = async (
    event: FormEvent<
      HTMLFormElement & {
        username: HTMLInputElement;
        password: HTMLInputElement;
      }
    >,
  ) => {
    event.preventDefault();

    const username = event.currentTarget.username.value;
    const password = event.currentTarget.password.value;

    await login({ username, password });

    if (router.query.from && typeof router.query.from === 'string') {
      router.push(router.query.from);
    } else {
      router.push('/');
    }
  };

  return (
    <>
      <Layout>
        <Head>
          <title>{'로그인'}</title>
        </Head>

        <div className="wrapper">
          <h1>로그인</h1>

          <form className="form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">유저이름</label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="유저네임"
              />
            </div>
            <div>
              <label htmlFor="password">비밀번호</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="비밀번호"
                pattern="[a-zA-Z0-9]{3,20}"
                title="Password should be digits (0 to 9) or alphabets (a to z)."
              />
            </div>
            <button type="submit">로그인</button>
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

export default Login;
