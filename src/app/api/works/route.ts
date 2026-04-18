import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'config', 'works.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    const works = JSON.parse(data);
    return NextResponse.json(works);
  } catch (error) {
    console.error('GET works error:', error);
    return NextResponse.json({ error: '获取作品失败' }, { status: 500 });
  }
}