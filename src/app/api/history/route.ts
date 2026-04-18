import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'config', 'history.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const history = JSON.parse(data);
    return NextResponse.json(history);
  } catch (error) {
    console.error('GET history error:', error);
    return NextResponse.json({ error: '获取历史失败' }, { status: 500 });
  }
}