import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Config from "../../../config";

export const getServerSideProps: GetServerSideProps<
  any,
  { username: string }
> = async (context) => {
  const username = context.params?.username;

  if (!username) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};

const UserPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  return (
    <>
      <Head>
        <title>{`${Config.title}`}</title>
      </Head>

      <style jsx>{``}</style>
    </>
  );
};

export default UserPage;
