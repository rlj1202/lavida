import Head from 'next/head';
import { useRouter } from 'next/router';

import { Default } from 'sequelize-typescript';
import DefaultLayout from '../../layouts/DeaultLayout';

import useSWR from 'swr';

import fetcher from '../../src/libs/fetcher';

import IProblem from '../../src/interfaces/IProblem';

export default function Problem() {
    const router = useRouter();
    const { id } = router.query;

    const problem = (function() {
        const { data, error } = useSWR(`/api/problems/${id}`, fetcher);
        return data as IProblem;
    })();

    return (
        <DefaultLayout>
            <Head>
                <title>{ problem?.title }</title>
            </Head>

            <h2># { problem?.id }</h2>
            <h1>{ problem?.title }</h1>

            작성자: { problem?.author?.name }

            <table className="table">
                <thead>
                    <tr>
                        <td>
                            시간 제한
                        </td>
                        <td>
                            메모리 제한
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            { problem?.timeLimit } ms
                        </td>
                        <td>
                            { problem?.memoryLimit } bytes
                        </td>
                    </tr>
                </tbody>
            </table>

            <h1>설명</h1>
            { problem?.description }

            <style jsx>{`
            .table {
                width: 100%;
                text-align: center;
                border: 1px solid #dddddd;
            }
            .table thead tr {
                font-weight: bold;
            }
            `}</style>
        </DefaultLayout>
    );
}