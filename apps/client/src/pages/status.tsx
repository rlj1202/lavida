import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { io } from "socket.io-client";
import Joi from "joi";

import Layout from "../components/Layout";
import { PaginationResponse } from "../schemas/pagination-response";
import { Submission } from "../schemas/submission";
import { getSubmissions } from "../services/submissions";

import Table from "../components/Table";
import TableHead from "../components/TableHead";
import TableBody from "../components/TableBody";
import TableRow from "../components/TableRow";
import TableCell from "../components/TableCell";

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

const querySchema = Joi.object<{
  username?: string;
  problemId?: number;
  top?: number;
  offset?: number;
  limit?: number;
}>({
  username: Joi.string().optional().allow(""),
  problemId: Joi.number().optional().allow(""),
  top: Joi.number().optional(),
  offset: Joi.number().default(0),
  limit: Joi.number().default(20),
});

const Status: NextPage = () => {
  const router = useRouter();
  const { error, value } = querySchema.validate(router.query);

  if (error) {
    throw error;
  }

  const [pages, setPages] = useState(0);

  const queryKey = [
    "submissions",
    value.username,
    value.problemId,
    value.offset,
    value.limit,
  ];
  const query = useQuery<PaginationResponse<Submission>>(
    queryKey,
    () =>
      getSubmissions({
        ...(!!value.username && { username: value.username }),
        ...(!!value.problemId && { problemId: value.problemId }),
        offset: value.offset,
        limit: value.limit,
      }),
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
    // TODO: server url
    const serverUrl = "http://localhost:3100";
    // On 'judge' namespace
    const socket = io(`${serverUrl}/judge`);

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

    return () => {
      if (socket && socket.connected) {
        socket.disconnect();
      }
    };
  });

  const dateTimeFormat = new Intl.DateTimeFormat("ko", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  const usernameRef = useRef<HTMLInputElement>(null);
  const problemIdRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    const nextUsername = usernameRef.current?.value;
    const nextProblemId = problemIdRef.current?.value;

    router.push({
      query: {
        ...router.query,
        username: nextUsername,
        problemId: nextProblemId,
      },
    });
  };

  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - Status`}</title>
        </Head>

        <h1>Status</h1>

        <div className="form">
          <label htmlFor="username">유저 이름</label>
          <input ref={usernameRef} id="username" type="text" />

          <label htmlFor="problem-id">문제 번호</label>
          <input ref={problemIdRef} id="problem-id" type="text" />

          <button onClick={handleSearch}>검색</button>
        </div>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>번호</TableCell>
              <TableCell>문제 번호</TableCell>
              <TableCell>유저 이름</TableCell>
              <TableCell>상태</TableCell>
              <TableCell>제출 날짜</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                <TableRow key={submission.id}>
                  <TableCell>{submission.id}</TableCell>
                  <TableCell>
                    <Link href={`/problems/${submission.problemId}`}>
                      {submission.problemId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/users/${submission.user?.username}`}>
                      {submission.user?.username}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className={`${statusClassName}`}>
                      {statusIndicator}
                    </span>
                  </TableCell>
                  <TableCell>
                    {dateTimeFormat.format(new Date(submission.createdAt))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Layout>

      <style jsx>{`
        h1 {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .form {
          margin-top: 1rem;
          margin-bottom: 1rem;
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
