import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';

import { searchProblems } from "../services/problems";

import Layout from "../components/Layout";
import Table from "../components/Table";
import TableBody from "../components/TableBody";
import TableCell from "../components/TableCell";
import TableHead from "../components/TableHead";
import TableRow from "../components/TableRow";

import Config from "../config";

const Search: NextPage = () => {
  const [queryString, setQueryString] = useState("");

  const query = useQuery(
    ["search", queryString],
    () => searchProblems({ query: queryString }),
    {}
  );

  return (
    <>
      <Layout>
        <Head>
          <title>{`${Config.title} - 검색`}</title>
        </Head>

        <div className="wrapper">
          <h1>Search</h1>

          <div className="search-form">
            <label htmlFor="query">검색어</label>
            <input
              id="query"
              type="text"
              onChange={(event) => setQueryString(event.currentTarget.value)}
            />
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>제목</TableCell>
                <TableCell>내용</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {query.isSuccess &&
                query.data.items.map((problem) => {
                  return (
                    <TableRow key={problem.id}>
                      <TableCell>
                        <Link href={`/problems/${problem.id}`}>
                          {problem.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="problem-description">
                          {problem.description}
                        </span>
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

        .problem-description {
        }
      `}</style>
    </>
  );
};

export default Search;
