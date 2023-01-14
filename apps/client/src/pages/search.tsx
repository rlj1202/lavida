import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";
import Layout from "../components/Layout";

import Config from "../config";
import { searchProblems } from "../services/problems";

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

        <div className="search-form">
          <label htmlFor="query">검색어</label>
          <input
            id="query"
            type="text"
            onChange={(event) => setQueryString(event.currentTarget.value)}
          />
        </div>

        <table className="problems">
          <thead>
            <tr>
              <td>제목</td>
              <td>내용</td>
            </tr>
          </thead>
          <tbody>
            {query.isSuccess &&
              query.data.items.map((problem) => {
                return (
                  <tr key={problem.id}>
                    <td>
                      <Link href={`/problems/${problem.id}`}>
                        {problem.title}
                      </Link>
                    </td>
                    <td>{problem.description}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Layout>

      <style jsx>{`
        .search-form {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .problems {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .problems thead {
          font-weight: bold;
        }
        .problems td {
          border: 1px solid #dddddd;
          padding: 0.4rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 0;
        }
      `}</style>
    </>
  );
};

export default Search;
