'use client';

import { PropagateLoader } from 'react-spinners';
import Link from 'next/link';
import Avatar from './Avatar';
import ScrollableBar from './ui/ScrollableBar';
import useMe from '@/hooks/me';

export default function FollowingBar() {
  const { user, isLoading, error } = useMe();
  const users = user?.following;

  return (
    <section className="relative z-0 w-full flex justify-center overflow-x-auto items-center p-4 shadow-sm shadow-neutral-300 mb-4 rounded-lg min-h-[90px]">
      {isLoading ? <PropagateLoader size={8} color="red" /> : (!users || users.length === 0) && <p>{`You don't have following`}</p>}
      {users && users.length > 0 && (
        <ScrollableBar>
          {users.map(({ image, username }) => (
            <Link key={username} className="flex flex-col items-center" href={`/user/${username}`}>
              <Avatar image={image} highlight />
              <p className="w-20 truncate text-sm text-center">{username}</p>
            </Link>
          ))}
        </ScrollableBar>
      )}
    </section>
  );
}
