'use client';
import usePosts from '@/hooks/posts';
import { PulseLoader } from 'react-spinners';
import PostListCard from './PostListCard';

export default function PostList() {
  const { posts, isLoading } = usePosts();
  return (
    <section>
      {isLoading && (
        <div className="text-center mt-32">
          <PulseLoader color="red" />
        </div>
      )}
      {posts && (
        <ul>
          {posts.map((post, index) => (
            <li className="mb-4" key={post.id}>
              <PostListCard post={post} priority={index < 2} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
