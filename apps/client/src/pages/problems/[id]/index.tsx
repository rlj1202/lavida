import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Config from "../../../config";

export const getServerSideProps: GetServerSideProps<
  any,
  { id: string }
> = async (context) => {
  const id = context.params?.id;

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};

const Problem: NextPage<
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

export default Problem;
