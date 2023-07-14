import { User } from '@/model/user';

// [...nextauth].ts에서 callbacks의 username 위한 타입 정의
declare module 'next-auth' {
  interface Session {
    user: User;
  }
}
