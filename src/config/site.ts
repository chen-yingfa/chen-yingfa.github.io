export const siteConfig = {
  title: "Yingfa Chen 陈英发",
  description: "Personal blog and research notes by Yingfa Chen.",
  siteUrl: "https://chen-yingfa.github.io",
  navItems: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/research_posts" },
    { label: "About Me", href: "/about" },
    { label: "Search", href: "/search", icon: "mingcute:search-line" },
  ],
  profile: {
    title: "Yingfa Chen － 陈英发",
    subtitle: `2nd year PhD student at Tsinghua University, advised by Prof. Zhiyuan Liu. Doing research on LLMs, continual learning, long-context modeling, and neural architecture.
<br><br>
<iconify-icon icon="mingcute:mail-line"></iconify-icon> <strong>Email:</strong> <a href="mailto:chenyingfa1999@gmail.com">chenyingfa1999@gmail.com</a>
<br><br>
(Not considering internships for now)      
<br>
(暂不考虑实习机会)`,
    imageUrl: "/images/portrait.png",
    imageAlt: "Portrait of Yingfa Chen",
    socialLinks: [
      { label: "GitHub", href: "https://github.com/chen-yingfa", icon: "mingcute:github-line" },
      {
        label: "Google Scholar",
        href: "https://scholar.google.com/citations?user=IgPWvEQAAAAJ&hl=en",
        icon: "mingcute:book-6-line",
      },
      { label: "X", href: "https://x.com/yingfachen", icon: "mingcute:social-x-line" },
      { label: "Zhihu", href: "https://www.zhihu.com/people/chen-ying-fa-34", icon: "simple-icons:zhihu" },
      {
        label: "Xiaohongshu",
        href: "https://www.xiaohongshu.com/user/profile/64a16a5c0000000011002ba4",
        icon: "simple-icons:xiaohongshu",
      },
    ],
    button: { label: "GitHub", href: "https://github.com/chen-yingfa" },
  },
} as const;
