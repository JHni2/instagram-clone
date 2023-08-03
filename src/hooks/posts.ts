import { Comment, SimplePost } from '@/model/post';
import { useCallback } from 'react';
import useSWR from 'swr';

async function updateLike(id: string, like: boolean) {
  return fetch('/api/likes', {
    method: 'PUT',
    body: JSON.stringify({ id, like }),
  }).then((res) => res.json());
}

async function addComment(id: string, comment: string) {
  return fetch('/api/comments', {
    method: 'POST',
    body: JSON.stringify({ id, comment }),
  }).then((res) => res.json());
}

export default function usePosts() {
  const { data: posts, isLoading, error, mutate } = useSWR<SimplePost[]>('/api/posts');

  // useCallback을 사용해서 posts, mutate가 변경될 때마다 새 함수를 만들어 setLike 할당하기
  const setLike = useCallback(
    (post: SimplePost, username: string, like: boolean) => {
      const newPost = { ...post, likes: like ? [...post.likes, username] : post.likes.filter((item) => item !== username) };
      const newPosts = posts?.map((p) => (p.id === post.id ? newPost : p));

      return mutate(updateLike(post.id, like), {
        optimisticData: newPosts, // 로컬 상에 있는 캐시를 이용해 UI를 업데이트하기
        populateCache: false, // 반환된 값을 기존 post 데이터에 덮어 쓰지 X
        revalidate: false, // newPosts 배열이 있기 때문에 backend에서 다시 받아올 필요 X
        rollbackOnError: true, // backend에 제대로 업데이트 되지 않았을 때 rollback
      });
    },
    [mutate, posts]
  );

  // useCallback을 사용해서 posts, mutate가 변경될 때마다 새 함수를 만들어 postComment 할당하기
  const postComment = useCallback(
    (post: SimplePost, comment: Comment) => {
      const newPost = { ...post, comments: post.comments + 1 };
      const newPosts = posts?.map((p) => (p.id === post.id ? newPost : p));

      return mutate(addComment(post.id, comment.comment), {
        optimisticData: newPosts, // 로컬 상에 있는 캐시를 이용해 UI를 업데이트하기
        populateCache: false, // 반환된 값을 기존 post 데이터에 덮어 쓰지 X
        revalidate: false, // newPosts 배열이 있기 때문에 backend에서 다시 받아올 필요 X
        rollbackOnError: true, // backend에 제대로 업데이트 되지 않았을 때 rollback
      });
    },
    [mutate, posts]
  );

  return { posts, isLoading, error, setLike, postComment };
}
