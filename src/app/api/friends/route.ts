import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'config', 'friend.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const friends = JSON.parse(data);
    return NextResponse.json(friends);
  } catch (error) {
    console.error('GET friends error:', error);
    return NextResponse.json({ error: '获取友链失败' }, { status: 500 });
  }
}