import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const articleKey = searchParams.get('articleKey') || 'default';
  const page = parseInt(searchParams.get('page') || '1');
  const size = parseInt(searchParams.get('size') || '10');

  try {
    const where = {
      articleKey,
      status: 'approved',
      isDeleted: false,
    };

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
    console.error('GET comments error:', error);
    return NextResponse.json({ error: '获取评论失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleKey, userName, userEmail, content } = body;

    if (!userName || !userEmail || !content) {
      return NextResponse.json({ error: '请填写所有字段' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        articleKey: articleKey || 'default',
        userName: userName.slice(0, 50),
        userEmail: userEmail.slice(0, 100),
        content: content.slice(0, 2000),
        status: 'pending',
      },
    });

    return NextResponse.json({ comment, message: '评论已提交，等待审核' });
  } catch (error) {
    console.error('POST comment error:', error);
    return NextResponse.json({ error: '提交评论失败' }, { status: 500 });
  }
}