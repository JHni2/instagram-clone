import { searchUsers } from '@/service/user';
import { NextResponse } from 'next/server';

// 요청이 오면 수행하도록! (static하지 X)
export const dynamic = 'force-dynamic';

export async function GET() {
  return searchUsers().then((data) => NextResponse.json(data));
}
