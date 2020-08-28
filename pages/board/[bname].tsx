import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
    var { bname } = context.query;

    return {
        props: {
            test: context.query
        }
    };
};

export default function Board({}) {
    const router = useRouter();
    const { bname } = router.query;

    console.log('test');

    return (
        <>
            <Head>
                <title>{ bname }</title>
            </Head>

        </>
    );
}