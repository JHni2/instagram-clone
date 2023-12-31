import { Comment, FullPost } from '@/model/post';
import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';

async function addComment(id: string, comment: string) {
  return fetch('/api/comments', {
    method: 'POST',
    body: JSON.stringify({ id, comment }),
  }).then((res) => res.json());
}

export default function useFullPost(postId: string) {
  const { data: post, isLoading, error, mutate } = useSWR<FullPost>(`/api/posts/${postId}`);

  const { mutate: globalMutate } = useSWRConfig();

  // useCallback을 사용해서 post, mutate, globalMutate가 변경될 때마다 새 함수를 만들어 postComment에 할당하기
  const postComment = useCallback(
    (comment: Comment) => {
      if (!post) return;

      const newPost = { ...post, comments: [...post.comments, comment] };

      return mutate(addComment(post.id, comment.comment), {
        optimisticData: newPost, // 로컬 상에 있는 캐시를 이용해 UI를 업데이트하기
        populateCache: false, // 반환된 값을 기존 post 데이터에 덮어 쓰지 X
        revalidate: false, // newPosts 배열이 있기 때문에 backend에서 다시 받아올 필요 X
        rollbackOnError: true, // backend에 제대로 업데이트 되지 않았을 때 rollback
      }).then(() => globalMutate('/api/posts'));
    },
    [post, mutate, globalMutate]
  );

  return { post, isLoading, error, postComment };
}
