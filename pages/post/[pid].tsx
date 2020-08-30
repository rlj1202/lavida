import { useRouter } from 'next/router';
import useSWR from 'swr';
import dateFormat from 'dateformat';

import fetcher from '../../src/libs/fetcher'

import Topbar from '../../components/topbar';
import Footer from '../../components/footer';
import IPost from '../../src/interfaces/IPost';

export default function Post() {
  const router = useRouter();
  const { pid } = router.query;

  const { data, error } = useSWR(`/api/posts/${pid}`, fetcher);
  var post = data as (IPost | undefined | null);

  return (
    <>
      <Topbar />

      <div className="wrapper">
        <div>{ post?.title }</div>
        <div>{post?.author?.authId}가 작성</div>
        <div>{dateFormat(post?.createdAt)}에 작성됨 · {dateFormat(post?.updatedAt)}에 수정됨</div>
        { post?.content }
      </div>

      <Footer />

      <style jsx>{`
        .wrapper {
          width: 1000px;
          margin: 40px auto;
          padding: 0 40px;
        }
      `}</style>
    </>
  );
}