'use client';

import { useState } from 'react';
import useSWR from 'swr';

export default function UserSearch() {
  const [keyword, setKeyword] = useState('');
  const { data, isLoading, error } = useSWR(`/api/search/${keyword}`);

  console.log(data);

  return <div></div>;
}
