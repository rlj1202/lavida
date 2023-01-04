import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import Layout from "../components/Layout";
import Config from "../config";
import { PaginationResponse } from "../schemas/pagination-response";
import { Submission } from "../schemas/submission";
import { getSubmissions } from "../services/submissions";

const Status: NextPage = () => {
  const router = useRouter();
  const { username, problemId, offset, limit } = router.query;

  if (username && typeof username !== "string") throw new Error();
  if (problemId && typeof problemId !== "string") throw new Error();
  if (offset && typeof offset !== "string") throw new Error();
  if (limit && typeof limit !== "string") throw new Error();

  const query = useQuery<PaginationResponse<Submission>>(
    ["submissions", username, problemId, offset, limit],
    () => getSubmissions({ username, problemId, offset, limit })
  );

  return (
    <>
      <Head>
        <title>{`${Config.title} - Status`}</title>
      </Head>

      <Layout>
        <h1>Status</h1>

        <table className="submissions">
          <thead>
            <tr>
              <td>id</td>
              <td>problemId</td>
              <td>username</td>
              <td>status</td>
              <td>submittedAt</td>
            </tr>
          </thead>
          <tbody>
            {query.data?.items.map((submission) => {
              return (
                <tr key={submission.id}>
                  <td>{submission.id}</td>
                  <td>
                    <Link href={`/problems/${submission.problemId}`}>
                      {submission.problemId}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/users/${submission.user?.username}`}>
                      {submission.user?.username}
                    </Link>
                  </td>
                  <td>{submission.status}</td>
                  <td>{submission.createdAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>

      <style jsx>{`
        .submissions {
          border: 1px solid black;
        }
      `}</style>
    </>
  );
};

export default Status;
