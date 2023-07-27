'use client';

import { ProfileUser } from '@/model/user';
import { FormEvent, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import useSWR from 'swr';

export default function UserSearch() {
  const [keyword, setKeyword] = useState('');
  const { data: users, isLoading, error } = useSWR<ProfileUser[]>(`/api/search/${keyword}`);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault;
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" autoFocus placeholder="Search for a username or name" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      </form>
      {error && <p>무언가 잘못 되었음 😅</p>}
      {isLoading && <PropagateLoader />}
      {!isLoading && !error && users?.length === 0 && <p>찾는 사용자가 존재하지 않음</p>}
      <ul>
        {users &&
          users.map((user) => (
            <li key={user.username}>
              <p>{user.username}</p>
            </li>
          ))}
      </ul>
    </>
  );
}
