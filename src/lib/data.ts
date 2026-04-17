export interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
}

export interface DesktopIcon {
  id: string;
  label: string;
  icon: string;
  action: string;
}

export interface Friend {
  name: string;
  avatar: string;
  slogan: string;
  url: string;
}

export interface HistoryEvent {
  date: string;
  event: string;
}

export const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'about', label: '关于我', icon: '/icons/user.png', action: 'openAbout' },
  { id: 'works', label: '作品集', icon: '/icons/folder.png', action: 'openWorks' },
  { id: 'articles', label: '文章', icon: '/icons/document.png', action: 'openArticles' },
  { id: 'links', label: '友链', icon: '/icons/favorites.png', action: 'openLinks' },
  { id: 'guestbook', label: '留言板', icon: '/icons/mail.png', action: 'openGuestbook' },
  { id: 'history', label: '变迁史', icon: '/icons/history.png', action: 'openHistory' },
];

export const FRIENDS: Friend[] = [
  {
    name: 'Xrect1fy',
    avatar: 'https://cdn.jsdelivr.net/gh/Xrect1fy/picorep//img/202306221140307.jpg',
    slogan: '一名坚持学习的安全小白',
    url: 'https://xrect1fy.github.io/'
  },
  {
    name: 'cyt的笔记屋',
    avatar: 'https://youcyt.ltd/img/other/avatar.png',
    slogan: 'cyt的博客',
    url: 'https://youcyt.ltd/'
  },
  {
    name: "Baka Mashiro's Home",
    avatar: 'https://avatars.githubusercontent.com/u/53376445?v=4',
    slogan: 'TECH OTAKUS SAVE THE WORLD',
    url: 'https://blog.yuzhes.com/'
  },
  {
    name: 'Dustella 的自留地',
    avatar: 'https://avatars.githubusercontent.com/u/30797133?v=4',
    slogan: '技术很厉害的学长大佬',
    url: 'https://www.dustella.net/'
  },
  {
    name: '北雁云依的博客',
    avatar: 'https://stblog.penclub.club/%E5%A4%B4%E5%83%8F%E5%9C%86.webp',
    slogan: '把信拿去吧，你可以假戏真做',
    url: 'https://stblog.penclub.club/'
  },
  {
    name: 'Matrix的博客',
    avatar: 'http://laysath.cn/content/uploadfile/202305/ad7b1684999257.jpg',
    slogan: 'Matrix译为"矩阵"',
    url: 'http://laysath.cn/'
  },
];

export const HISTORY: HistoryEvent[] = [
  { date: '2022.9.1', event: '想拥有自己的主页' },
  { date: '2022.10.31', event: '「littlewith.tk」域名注册' },
  { date: '2022.11.25', event: '初步完成，第一版主页上线' },
  { date: '2022.12.27', event: '「littlewith.top」域名注册' },
  { date: '2023.1.28', event: '主页上新，评论系统上线' },
  { date: '2023.6.11', event: '服务器到期，网站大迁移' },
  { date: '2023.8.25', event: '主页再次更新，加入暗黑模式' },
  { date: '2023.8.28', event: '增加小文章功能' },
  { date: '2023.8.28', event: '友情链接功能上线' },
  { date: '2025.3.16', event: '域名更换www.littleandrew.cn' },
];

export const WORKS = [
  {
    name: 'LittleTrans',
    description: '用Golang实现的文件传输',
    url: 'https://github.com/littlewith/LittleTrans/',
  },
  {
    name: 'BingPaper',
    description: '每日Bing壁纸应用工具',
    url: 'https://littlewith.github.io/2022/08/31/',
  },
  {
    name: 'LittleCode',
    description: '一个多功能加密解密小工具',
    url: 'https://github.com/littlewith/LittleCode/',
  },
  {
    name: 'LittleTrojan',
    description: '基于Golang的远控程序',
    url: 'https://github.com/littlewith/LittleTrojan/',
  },
];

export const ABOUT_ME = {
  title: '小和 (LittleAndrew)',
  tags: ['零零后', '网安从业', '爱猫人士', '摸鱼担当', 'popping', '代码诗人'],
  description: [
    '嗨！你好。我是 小和',
    '是街舞爱好者、音乐欣赏家',
    '努力学popping、努力理解音乐情绪',
    '',
    '热衷于计算机，爱钻研一切技术：',
    '前后端交互、媒体技术、网络安全',
    '',
    '工科男却热爱文学，兼感性和理性于一身',
    '偶尔emo......',
    '爱看名著，虽涉猎甚少',
    '',
    '爱拍风景，略懂摄影技巧',
    '钟爱小动物，尤其是猫',
    '',
    '心态乐观、爱交朋友',
    '！请多多指教！',
  ],
  works: WORKS,
  contact: {
    email: 'andyw2002@foxmail.com',
    github: 'https://github.com/littlewith/',
    blog: 'https://blog.littleandrew.cn/',
    csdn: 'https://blog.csdn.net/Andytoe',
  },
};

export function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}