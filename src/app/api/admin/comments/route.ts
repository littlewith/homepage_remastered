import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = request.headers.get('x-admin-token');
  const page = parseInt(searchParams.get('page') || '1');
  const size = parseInt(searchParams.get('size') || '20');
  const status = searchParams.get('status');

  if (!token) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  if (token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '口令错误' }, { status: 401 });
  }

  try {
    const where: any = { isDeleted: false };
    if (status && status !== 'all') where.status = status;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * size,
        take: size,
      }),
      prisma.comment.count({ where }),
    ]);

    return NextResponse.json({ comments, total, page, size });
  } catch (error) {
    console.error('GET admin comments error:', error);
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const token = request.headers.get('x-admin-token');

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    const comment = await prisma.comment.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('PATCH comment error:', error);
    return NextResponse.json({ error: '更新评论失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = request.headers.get('x-admin-token');

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '未授权' }, { status: 401 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const id = parseInt(searchParams.get('id') || '0');

    await prisma.comment.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE comment error:', error);
    return NextResponse.json({ error: '删除评论失败' }, { status: 500 });
  }
}