import Head from 'next/head';

export default function Login() {
  return (
    <>
      <Head>
        <title>로그인</title>
      </Head>

      <div className="wrapper">
        <div className="login-form">
          <form method="POST" id="login-form" action="/auth/signin">
            <header className="title">로그인</header>
            <div className="row">
              <label className="label" htmlFor="id">아이디</label>
              <input className="input" id="id" placeholder="id" name="id" required/>
            </div>
            <div className="row">
              <label className="label" htmlFor="password">비밀번호</label>
              <input className="input" id="password" placeholder="password" type="password" name="password" required/>
            </div>
            <button className="button" type="submit">확인</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          height: 100%;

          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-form {
          border-radius: 5px;
          border: 1px solid #dddddd;
          width: 400px;
          margin: 0 auto;
          padding: 10px 20px;
          font-family: 'NanumSquare', sans-serif;
        }

        .title {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
        }

        .row {
          margin: 0.5rem 0;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
        .label {
          width: 100px;
          display: inline-block;
        }
        .input {
          border-radius: 3px;
          border: 1px solid #dddddd;
          padding: 0.5rem;
          flex: 1;
        }

        .button {
          border-radius: 5px;
          border: 1px solid #dddddd;
          padding: 5px 20px;
          background-color: var(--ansi-cyan);
          color: white;
          margin: 0.5rem 0;

          float: right;
          clear: right;
        }
      `}</style>
    </>
  );
};
