import { NextPage } from "next";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";

import Layout from "../../components/Layout";
import Table from "../../components/Table";
import TableBody from "../../components/TableBody";
import TableCell from "../../components/TableCell";
import TableHead from "../../components/TableHead";
import TableRow from "../../components/TableRow";

import { authenticate } from "../../services/auth";

import { useAppSelector } from "../../store/hooks";

const SettingPage: NextPage = () => {
  const query = useQuery(["authenticate"], () => authenticate(), {
    initialData: useAppSelector((state) => state.auth.user),
  });

  const user = query.data;

  if (!user) {
    throw new Error("no user");
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{`${user.username} 설정`}</title>
        </Head>

        <div className="wrapper">
          <h1>{`${user.username} 설정`}</h1>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>항목</TableCell>
                <TableCell>값</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>이메일</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
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

export default SettingPage;
