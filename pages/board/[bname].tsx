import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import useSWR from 'swr';

async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
    const res = await fetch(input, init);
    return res.json();
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    var { bname } = context.query;

    return {
        props: {
        }
    };
};

export default function Board({}) {
    const router = useRouter();
    const { bname } = router.query;

    const { data, error } = useSWR(`/api/board/${bname}`, fetcher);

    console.log(data);

    return (
        <>
            <Head>
                <title>{ data?.title ?? bname }</title>
            </Head>

            <h1>{ data?.title ?? bname }</h1>
            { data?.description ?? 'no description' }
            { data?.posts && data.posts.map((post: { title: string, content: string }) => {
                return (
                    <div key="post.title">
                        <h2>{ post.title }</h2>
                        { post.content }
                    </div>
                );
            }) }
        </>
    );
}