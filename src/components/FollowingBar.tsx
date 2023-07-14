'use client';

import useSWR from 'swr';

export default function FollowingBar() {
  const { data, isLoading, error } = useSWR('/api/me');
  console.log(data);

  return <div>FollwingBar</div>;
}
