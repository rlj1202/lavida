import { NextPage } from "next";
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
    }

    await register({ username, email, password });

    router.push("/");
  };

  return (
    <>
      <Layout>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" type="text" />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />

          <label htmlFor="passwordCheck">Password Check</label>
          <input id="passwordCheck" name="passwordCheck" type="password" />

          <button type="submit">등록하기</button>
        </form>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};
export default Register;