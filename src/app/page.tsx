import FollowingBar from '@/components/ui/FollowingBar';
import PostList from '@/components/ui/PostList';
import Sidebar from '@/components/ui/Sidebar';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <section>
      <FollowingBar />
      <PostList />
      <Sidebar user={user} />
    </section>
  );
}
