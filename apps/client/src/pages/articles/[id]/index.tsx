import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useRef } from 'react';

import Layout from '../../../components/Layout';

import { getArticle } from '../../../services/articles';
import {
  createComment,
  CreateCommentParams,
  getComments,
} from '../../../services/comments';

const ArticlePage: NextPage = () => {
  const router = useRouter();

  const { id } = router.query as { id: string };

  const queryClient = useQueryClient();

  const articleQuery = useQuery(['article', id], () => getArticle(id), {
    enabled: !!id,
  });

  const commentsQuery = useQuery(
    ['article', id, 'comments'],
    () => getComments({ articleId: id }),
    { enabled: !!id },
  );

  const commentMutation = useMutation(
    async (options: CreateCommentParams) => {
      return createComment(options);
    },
    {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(['article', id, 'comments']);
      },
    },
  );

  const commentContentRef = useRef<HTMLTextAreaElement>(null);

  if (articleQuery.status !== 'success' || commentsQuery.status !== 'success') {
    return <></>;
  }

  const article = articleQuery.data;
  const comments = commentsQuery.data;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!commentContentRef.current) return;

    const commentContent = commentContentRef.current.value;

    commentMutation.mutate({ articleId: id, content: commentContent });
  };

  return (
    <>
      <Layout>
        <Head>
          <title>{`${article.title}`}</title>
        </Head>

        <div className="wrapper">
          <h1>{article.title}</h1>
          <div>{article.content}</div>

          <hr />
          <div className="comments">
            {comments.items.map((comment) => {
              return (
                <div key={comment.id} className="comment">
                  <div className="">{comment.createdAt}</div>
                  <div className="">
                    <Link href={`/users/${comment.author.username}`}>
                      {comment.author.username}
                    </Link>
                  </div>
                  <div className="">{comment.content}</div>
                </div>
              );
            })}
          </div>
          <hr />
          <form className="" onSubmit={handleSubmit}>
            <textarea
              ref={commentContentRef}
              className="comment-content"
            ></textarea>
            <button type="submit">작성하기</button>
          </form>
        </div>
      </Layout>

      <style jsx>{`
        .wrapper > * {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .comment {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .comment-content {
          width: 100%;
          min-height: 7rem;
        }
      `}</style>
    </>
  );
};

export default ArticlePage;
