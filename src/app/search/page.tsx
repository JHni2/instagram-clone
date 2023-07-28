import UserSearch from '@/components/UserSearch';
import { Metadata } from 'next';

// 요청이 오면 수행하도록! (static하지 X)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'User Search',
  description: 'Search users to follow',
};

export default function SearchPage() {
  return <UserSearch />;
}
