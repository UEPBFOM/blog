/** SEO-only copy. Visible headings and article metadata remain owned by their pages. */
const sections: Record<string, [string, string, string, string]> = {
  '/': [
    '首页',
    'MF_xian 的个人博客：记录编程学习、项目实践与日常思考。',
    'Home',
    'MF_xian’s notes on programming, projects, and everyday ideas.'
  ],
  '/about': ['关于我', '关于 MF_xian 和这个博客。', 'About', 'About MF_xian and this blog.'],
  '/contact': [
    '联系我',
    '通过 GitHub 或邮件联系 MF_xian。',
    'Contact',
    'Connect with MF_xian on GitHub or by email.'
  ],
  '/projects': [
    '项目',
    'MF_xian 的项目实践记录。',
    'Projects',
    'Projects and experiments by MF_xian.'
  ],
  '/links': ['友情链接', '朋友与独立博客。', 'Links', 'Friends and independent blogs.'],
  '/archives': ['文章归档', '按年份浏览博客文章。', 'Archives', 'Browse posts by year.']
}

export function sectionMetadata(pathname: string) {
  const en = /^\/en(?:\/|$)/.test(pathname)
  const bare = (en ? pathname.slice(3) : pathname).replace(/\/$/, '') || '/'
  const copy = sections[bare]
  return copy ? { title: copy[en ? 2 : 0], description: copy[en ? 3 : 1] } : undefined
}

export function listingMetadata(
  kind: 'blog' | 'notes' | 'lab',
  en: boolean,
  page: number,
  titles: string[],
  tag?: string | number
) {
  const name = en
    ? { blog: 'Blog', notes: 'Notes', lab: 'Lab' }[kind]
    : { blog: '博客', notes: '笔记', lab: '实验室' }[kind]
  const subject = tag ? (en ? `${name} tagged “${tag}”` : `${name} · ${tag} 标签`) : name
  const suffix = en ? `Page ${page}` : `第 ${page} 页`
  const examples = titles.slice(0, 3).join(en ? '; ' : '；')
  return {
    title: `${subject} · ${suffix}`,
    description: en
      ? `${subject}, page ${page}. ${examples ? `On this page: ${examples}.` : 'Browse published entries.'}`
      : `${subject}，第 ${page} 页。${examples ? `本页收录：${examples}。` : '浏览已发布的记录。'}`
  }
}
