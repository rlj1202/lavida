import Link from 'next/link';

import IBoard from '../src/interfaces/IBoard';
import IPost from '../src/interfaces/IPost';

import dateFormat from 'dateformat';

export default function Posts({ board, posts }: { board?: IBoard, posts?: IPost[] }) {
    return (
      <div className="posts">
        {posts && posts?.map((post: IPost, index) => {
          return (
            <div key={index} className="post">
              <div className="post-main">
                <div className="post-tags">
                  <span className="tag category">{board?.title}</span>
                  <span className="tag">테스트</span>
                </div>
                <div className="post-title">
                  <Link href={`/post/${post.id}`}><a>{post.title}</a></Link>
                </div>
              </div>
              <div className="post-likes">
                좋아요 수: 0
                  </div>
              <div className="post-comments">
                댓글 수: 0
                  </div>
              <div className="post-info">
                <div className="post-author">{post.author?.authId}</div>
                <div className="post-date">{dateFormat(post.createdAt)}</div>
              </div>
            </div>
          );
        })}
  
        <style jsx>{`
          .posts {
            border: 1px solid #dddddd;
            border-radius: 5px;
            margin: 20px 0;
          }
          .post {
            padding: 10px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #dddddd;
          }
          .post-tags {
            margin-bottom: 5px;
          }
          .post-tags .tag {
            border-radius: 5px;
            padding: 1px 4px;
            border: 1px solid #dddddd;
            margin-right: 5px;
            font-size: 0.7rem;
          }
          .post-tags .tag.category {
            background-color: var(--ansi-cyan);
            color: white;
          }
          .post:last-child {
            border-bottom: none;
          }
          .post-main {
            flex: 1;
            font-size: 0.8rem;
          }
          .post-comments, .post-likes, .post-info {
            margin-left: 20px;
            font-size: 0.7rem;
          }
          .post-title {
            font-size: 0.9rem;
            font-weight: bold;
          }
          .post-content {
            font-size: 0.8rem;
          }
        `}</style>
      </div>
    );
  }