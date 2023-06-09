import { NextPage } from 'next';
import Head from 'next/head';
import { useQuery } from '@tanstack/react-query';

import { getBoards } from '../../services/boards';

import Layout from '../../components/Layout';
import Config from '../../config';
import { Board } from '../../schemas/board';
import Table from '../../components/Table';
import TableBody from '../../components/TableBody';
import TableRow from '../../components/TableRow';
import TableCell from '../../components/TableCell';
import TableHead from '../../components/TableHead';
import Link from 'next/link';

const Boards: NextPage = () => {
  const queryKey = ['boards'];
  const query = useQuery(queryKey, () => getBoards(), {});

  const boards = query.isSuccess ? query.data : [];

  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Boards`}</title>
        </Head>

        <div className="wrapper">
          <h1>Boards</h1>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell>설명</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {boards.map((board) => {
                return (
                  <TableRow key={board.name}>
                    <TableCell>
                      <Link href={`/boards/${board.name}`}>{board.title}</Link>
                    </TableCell>
                    <TableCell>{board.description}</TableCell>
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

export default Boards;
