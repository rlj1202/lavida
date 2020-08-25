import Head from 'next/head'

export default function Register() {
  return (
    <>
      <Head>
        <title>회원가입</title>
      </Head>

      <div className="wrapper">
        <div className="form">
          <form method="POST" id="register-form" action="/auth/signup">
            <header className="title">회원가입</header>
            <div className="row">
              <label className="label" htmlFor="id">아이디</label>
              <input className="input" id="id" placeholder="id" name="id" required/>
            </div>
            <div className="row">
              <label className="label" htmlFor="password">비밀번호</label>
              <input className="input" id="password" placeholder="password" type="password" name="password" required/>
            </div>
            <div className="row">
              <label className="label" htmlFor="passwordCheck">비밀번호 확인</label>
              <input className="input" id="passwordCheck" placeholder="password" type="password" name="passwordCheck" required/>
            </div>
            <div className="row">
              <label className="label" htmlFor="name">이름</label>
              <input className="input" id="name" placeholder="name" name="name" required/>
            </div>
            <div className="row">
              <label className="label" htmlFor="e-mail">이메일</label>
              <input className="input" id="e-mail" placeholder="e-mail" name="email" />
            </div>
            <button className="button" type="submit">확인</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }
        .form {
          border-radius: 10px;
          border: 1px solid #dddddd;
          padding: 10px 20px;
          width: 400px;
          margin: 0 auto;
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
  )
}