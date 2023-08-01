import { SimplePost } from '@/model/post';
import useSWR from 'swr';

async function updateLike(id: string, like: boolean) {
  return fetch('/api/likes', {
    method: 'PUT',
    body: JSON.stringify({ id, like }),
  }).then((res) => res.json());
}

export default function usePosts() {
  const { data: posts, isLoading, error, mutate } = useSWR<SimplePost[]>('/api/posts');

  const setLike = (post: SimplePost, username: string, like: boolean) => {
    const newPost = { ...post, likes: like ? [...post.likes, username] : post.likes.filter((item) => item !== username) };
    const newPosts = posts?.map((p) => (p.id === post.id ? newPost : p));

    return mutate(updateLike(post.id, like), {
      optimisticData: newPosts, // 로컬 상에 있는 캐시를 이용해 UI를 업데이트하기
      populateCache: false, // 반환된 값을 기존 post 데이터에 덮어 쓰지 X
      revalidate: false, // newPosts 배열이 있기 때문에 backend에서 다시 받아올 필요 X
      rollbackOnError: true, // backend에 제대로 업데이트 되지 않았을 때 rollback
    });
  };

  return { posts, isLoading, error, setLike };
}
