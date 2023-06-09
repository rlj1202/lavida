import { useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import Table from '../../../components/Table';
import TableBody from '../../../components/TableBody';
import TableCell from '../../../components/TableCell';
import TableHead from '../../../components/TableHead';
import TableRow from '../../../components/TableRow';
import { getContest } from '../../../services/contests';

const ContestPage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query as { id: string };

  const query = useQuery(['contest', id], async () => getContest(id), {
    enabled: !!id,
  });

  if (query.status !== 'success') {
    return <></>;
  }

  const contest = query.data;

  return (
    <>
      <Layout>
        <Head>
          <title>{``}</title>
        </Head>

        <div className="wrapper">
          <h1>{contest.title}</h1>
          <p>{contest.description}</p>
          <ul>
            <li>시작 시간: {contest.startAt}</li>
            <li>종료 시간: {contest.endAt}</li>
          </ul>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>번호</TableCell>
                <TableCell>제목</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contest.contestProblems.map((problem) => {
                return (
                  <TableRow key={problem.order}>
                    <TableCell>{problem.order}</TableCell>
                    <TableCell>
                      <Link href={`/problems/${problem.problemId}`}>
                        {problem.problem.title}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Layout>

      <style jsx>{`
        .wrapper > * {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </>
  );
};

export default ContestPage;
