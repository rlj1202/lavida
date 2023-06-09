import { useMutation, useQuery } from '@tanstack/react-query';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FormEvent, useRef } from 'react';

import Layout from '../../../components/Layout';

import { createArticle, CreateArticleParams } from '../../../services/articles';
import { getBoardByName } from '../../../services/boards';

const WritePage: NextPage = () => {
  const router = useRouter();

  const { name } = router.query as { name: string };

  const query = useQuery(['board', name], () => getBoardByName(name), {
    enabled: !!name,
  });

  const mutation = useMutation(async (options: CreateArticleParams) => {
    return createArticle(options);
  });

  const articleTitleRef = useRef<HTMLInputElement>(null);
  const articleContentRef = useRef<HTMLTextAreaElement>(null);

  if (query.status !== 'success') {
    return <></>;
  }

  const board = query.data;

  const handleWrite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!articleTitleRef.current) return;
    if (!articleContentRef.current) return;

    const title = articleTitleRef.current.value;
    const content = articleContentRef.current.value;

    mutation.mutate(
      { title, content, boardName: board.name },
      {
        onSuccess(data, variables, context) {
          // TODO: push route to somewhere after creating article successfully
          router.push(`/articles/${data.id}`);
          return;
        },
      },
    );
  };

  return (
    <>
      <Layout>
        <Head>
          <title></title>
        </Head>

        <div className="wrapper">
          <h1>글쓰기</h1>
          <p>{board.title}</p>

          <form onSubmit={handleWrite}>
            <label htmlFor="title">제목</label>
            <input ref={articleTitleRef} id="title" placeholder="제목" />
            <textarea ref={articleContentRef} className="content"></textarea>
            <button className="" type="submit">
              작성하기
            </button>
          </form>
        </div>
      </Layout>

      <style jsx>{`
        .wrapper > * {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .content {
          display: block;
          width: 100%;
          min-height: 10rem;
        }
      `}</style>
    </>
  );
};

export default WritePage;
