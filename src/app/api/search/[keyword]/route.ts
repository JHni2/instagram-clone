import { searchUsers } from '@/service/user';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { keyword: string };
};

// 사용하지 않는 인자는 _로 표시
export async function GET(_: NextRequest, context: Context) {
  return searchUsers(context.params.keyword).then((data) => NextResponse.json(data));
}
