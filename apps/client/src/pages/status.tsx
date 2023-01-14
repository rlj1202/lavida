import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { io } from "socket.io-client";

import Layout from "../components/Layout";
import { PaginationResponse } from "../schemas/pagination-response";
import { Submission } from "../schemas/submission";
import { getSubmissions } from "../services/submissions";

import Config from "../config";

type JudgeStatus =
  | "SUBMITTED"
  | "JUDGING"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED";

const Status: NextPage = () => {
  const router = useRouter();
  const { username, problemId, top, offset, limit } = router.query;

  if (username && typeof username !== "string") throw new Error();
  if (problemId && typeof problemId !== "string") throw new Error();
  if (top && typeof top !== "string") throw new Error();
  if (offset && typeof offset !== "string") throw new Error();
  if (limit && typeof limit !== "string") throw new Error();

  const queryClient = useQueryClient();

  const [pages, setPages] = useState(0);

  const queryKey = ["submissions", username, problemId, offset, limit];
  const query = useQuery<PaginationResponse<Submission>>(
    queryKey,
    () => getSubmissions({ username, problemId, offset, limit }),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setPages(Math.ceil(data.total / data.limit));
      },
    }
  );

  const [statuses, setStatuses] = useState<
    Map<number, { status: JudgeStatus; progress: number }>
  >(new Map());

  useEffect(() => {
    // On 'judge' namespace
    // TODO: server url
    const socket = io("http://localhost:3100/judge");

    socket.on("connect", () => {
      query.data?.items
        .map((item) => item.id)
        .forEach((submissionId) => {
          socket.emit("getJudgeStatus", { submissionId });
        });
    });

    socket.on(
      "status",
      (response: {
        submissionId: number;
        progress: number;
        status: JudgeStatus;
      }) => {
        setStatuses((old) =>
          new Map(old).set(response.submissionId, {
            status: response.status,
            progress: response.progress,
          })
        );
      }
    );

    if (socket) {
      return () => {
        socket.disconnect();
      };
    }
  });

  const dateTimeFormat = new Intl.DateTimeFormat("ko", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Status`}</title>
        </Head>

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
              const info = statuses.get(submission.id);

              const status = info?.status || submission.status;
              const progress = info?.progress || 0;

              let statusIndicator = `${status}`;

              if (status === "JUDGING") {
                statusIndicator = `${status} ${progress.toFixed(2)}%`;
              }

              let statusClassName = "";
              switch (status) {
                case "ACCEPTED":
                  statusClassName = "status-ac";
                  break;
                case "WRONG_ANSWER":
                  statusClassName = "status-wa";
                  break;
                case "TIME_LIMIT_EXCEEDED":
                  statusClassName = "status-tle";
                  break;
                case "MEMORY_LIMIT_EXCEEDED":
                  statusClassName = "status-mem";
                  break;
                case "SERVER_ERROR":
                  statusClassName = "status-er";
                  break;
              }

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
                  <td className={`status ${statusClassName}`}>
                    {statusIndicator}
                  </td>
                  <td>
                    {dateTimeFormat.format(new Date(submission.createdAt))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>

      <style jsx>{`
        h1 {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
        .submissions {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .submissions,
        .submissions tr,
        .submissions td {
          border: 1px solid #dddddd;
        }
        .submissions thead {
          font-weight: bold;
        }
        .submissions td {
          padding: 0.4rem;
        }

        .status-ac {
          color: green;
        }
        .status-wa,
        .status-tle,
        .status-mem {
          color: red;
        }
        .status-er {
          color: purple;
        }
      `}</style>
    </>
  );
};

export default Status;
