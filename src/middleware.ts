import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/phpmyadmin/:path*',
    '/phpinfo/:path*',
    '/admin.php/:path*',
    '/wp-admin/:path*',
    '/wp-login/:path*',
    '/wp-includes/:path*',
    '/xmlrpc.php',
    '/.git/config',
    '/.env',
    '/server-status',
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 安全路由 - 虚假页面
  const safetyRoutes = [
    '/phpmyadmin',
    '/phpinfo',
    '/admin.php',
    '/wp-admin',
    '/wp-login',
    '/wp-includes',
    '/xmlrpc.php',
    '/.git/config',
    '/.env',
    '/server-status',
  ];

  for (const route of safetyRoutes) {
    if (pathname.startsWith(route) || pathname === route) {
      // 使用内部重定向到 Next.js 页面
      const dest = route.includes('phpmyadmin') ? '/phpmyadmin' : '/phpinfo';
      return NextResponse.rewrite(new URL(dest, request.url));
    }
  }

  return NextResponse.next();
}