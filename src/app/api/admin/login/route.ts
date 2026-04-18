import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: '请输入口令' }, { status: 400 });
    }

    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true, token: process.env.ADMIN_PASSWORD });
    } else {
      return NextResponse.json({ error: '口令错误' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}