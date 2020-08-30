import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import dateFormat from 'dateformat';

import fetcher from '../../src/libs/fetcher'

import Topbar from '../../components/topbar';
import Footer from '../../components/footer';
import IPost from '../../src/interfaces/IPost';
import { IUser } from '../../src/interfaces/IUser';
import IComment from '../../src/interfaces/IComment';

export default function Post() {
  const router = useRouter();
  const { pid } = router.query;

  var user = (() => {
    const { data, error } = useSWR('/auth/info', fetcher);
    return data as (IUser | undefined | null);
  })();

  var post = (() => {
    const { data, error } = useSWR(`/api/posts/${pid}`, fetcher);
    return data as (IPost | undefined | null);
  })();

  var comments = (() => {
    const { data, error } = useSWR(`/api/posts/${pid}/comments`, fetcher);
    return data as (IComment[] | undefined | null);
  })();

  return (
    <>
      <Topbar />

      <div className="wrapper">
        <div className="postid">#{post?.id}</div>
        <div className="author">{post?.author?.authId}가 작성</div>
        <div className="date">{dateFormat(post?.createdAt)}에 작성됨 · {dateFormat(post?.updatedAt)}에 수정됨</div>
        <h1>{ post?.title }</h1>
        <div className="content">{ post?.content }</div>

        <div className="comments">
          { comments && comments.map(comment => (
            <div className="comment">
              <div className="comment-author">{comment.author?.authId}</div>
              <div className="comment-date">
                {dateFormat(comment.createdAt)}에 작성됨
                </div>
              <div className="comment-content">{comment.content}</div>
              <div className="comment-buttons">
                <span className="comment-button">
                  <Link href="/"><a>수정</a></Link>
                </span>
                <span className="comment-button">
                  <Link href="/"><a>삭제</a></Link>
                </span>
                <span className="comment-button">
                  <Link href="/"><a>답글</a></Link>
                </span>
              </div>
            </div>
          )) }
          { user && <>
            <div className="comment">
              <form method="POST" action={`/api/posts/${post?.id}/comments`}>
                <input name="authorId" value={user.id} hidden/>
                <textarea className="comment-input" name="content"></textarea>
                <button type="submit" className="comment-submit">
                  댓글 쓰기
                </button>
              </form>
            </div>
          </> }
          { !user && <>
            <div className="comment unable-to-comment">
              댓글을 작성하려면 <Link href="/login"><a className="comment-login">로그인</a></Link>하세요.
            </div>
          </> }
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .wrapper {
          max-width: 1000px;
          margin: 40px auto;
          padding: 0 40px;
        }

        .author, .date, .postid {
          font-size: 0.8rem;
          color: gray;
        }

        .comments {
          border-radius: 5px;
          border: 1px solid #dddddd;
          margin: 20px 0;
        }
        .comment {
          padding: 10px;
          border-bottom: 1px solid #dddddd;
        }
        .comment-author {
          font-size: 0.9rem;
        }
        .comment-date {
          color: gray;
          font-size: 0.8rem;
        }
        .comment:last-child {
          border-bottom: none;
        }
        .comment-content {
          margin: 5px 0;
        }
        .comment-button {
          font-size: 0.7rem;
          margin-right: 5px;
        }
        .comment-input {
          border: 1px solid #dddddd;
          border-radius: 5px;
          display: block;
          width: 100%;
          margin-bottom: 10px;
          resize: vertical;
          min-height: 100px;
        }
        .comment-submit {
          display: block;
          border-radius: 5px;
          border: 1px solid #dddddd;
          padding: 5px 20px;
        }
        .comment.unable-to-comment {
          text-align: center;
          font-size: 0.8rem;
          color: gray;
        }
        .comment-login {
          text-decoration: underline;
        }
      `}</style>
    </>
  );
}