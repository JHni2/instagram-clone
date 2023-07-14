import NextAuth, { DefaultSession } from 'next-auth';

// [...nextauth].ts에서 callbacks의 username 위한 타입 정의
declare module 'next-auth' {
  interface Session {
    user: {
      username: string;
    } & DefaultSession['user'];
  }
}
