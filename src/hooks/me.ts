import { HomeUser } from '@/model/user';
import { useCallback } from 'react';
import useSWR from 'swr';

async function updateBookmark(postId: string, bookmark: boolean) {
  return fetch('/api/bookmarks', {
    method: 'PUT',
    body: JSON.stringify({ id: postId, bookmark }),
  }).then((res) => res.json());
}

export default function useMe() {
  const { data: user, isLoading, error, mutate } = useSWR<HomeUser>('/api/me');

  // useCallback을 사용해서 user, mutate가 변경될 때마다 새 함수를 만들어 setBookmark에 할당하기
  const setBookmark = useCallback(
    (postId: string, bookmark: boolean) => {
      if (!user) return;

      const bookmarks = user.bookmarks;
      const newUser = {
        ...user,
        bookmarks: bookmark ? [...bookmarks, postId] : bookmarks.filter((b) => b !== postId),
      };

      return mutate(updateBookmark(postId, bookmark), {
        optimisticData: newUser, // 로컬 상에 있는 캐시를 이용해 UI를 업데이트하기
        populateCache: false, // 반환된 값을 기존 post 데이터에 덮어 쓰지 X
        revalidate: false, // newPosts 배열이 있기 때문에 backend에서 다시 받아올 필요 X
        rollbackOnError: true, // backend에 제대로 업데이트 되지 않았을 때 rollback
      });
    },
    [user, mutate]
  );

  return { user, isLoading, error, setBookmark };
}
