import { getProviders } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { redirect } from 'next/navigation';
import Signin from '@/components/Signin';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Signin',
  description: 'Signup or Login to Instagram-clone',
};

type Props = {
  searchParams: {
    callbackUrl: string;
  };
};

export default async function SigninPage({ searchParams: { callbackUrl } }: Props) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  const providers = (await getProviders()) ?? {};

  console.log(session, providers);

  return (
    <section className="flex justify-center mt-24">
      <Signin providers={providers} callbackUrl={callbackUrl ?? '/'} />
    </section>
  );
}
