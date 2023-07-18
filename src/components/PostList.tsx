'use client';
import { SimplePost } from '@/model/post';
import { PulseLoader } from 'react-spinners';
import useSWR from 'swr';
import PostListCard from './PostListCard';

export default function PostList() {
  const { data: posts, isLoading } = useSWR<SimplePost[]>('/api/posts');

  return (
    <section>
      {isLoading && (
        <div>
          <PulseLoader color="red" />
        </div>
      )}
      {posts && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <PostListCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
