import Layout from "apps/client/src/components/Layout";
import { getUser } from "apps/client/src/services/users";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import { useQuery } from "react-query";
import Config from "../../../config";

interface Params extends ParsedUrlQuery {
  username: string;
}

interface Props {
  username: string;
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async (
  context
) => {
  const username = context.params?.username;

  if (!username) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      username,
    },
  };
};

const UserPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ username }) => {
  const query = useQuery(["user", username], () => getUser(username));

  return (
    <>
      <Head>
        <title>{`${Config.title} - ${username}`}</title>
      </Head>

      <Layout>
        <div>{query.data?.username}</div>
        <div>{query.data?.id}</div>
        <div>{query.data?.email}</div>
      </Layout>

      <style jsx>{``}</style>
    </>
  );
};

export default UserPage;
