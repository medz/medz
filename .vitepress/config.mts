import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Seven Du",
  description: "Seven Du's Portfolio",
  cleanUrls: true,
  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
    ],
    ["meta", { name: "twitter:site", content: "@shiweidu" }],
    ["meta", { name: "twitter:card", content: "summary" }],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://www.github.com/medz.png",
      },
    ],
  ],
  sitemap: { hostname: "https://medz.cn" },
  themeConfig: {
    logo: "/favicon.png",
    siteTitle: false,
    nav: [
      { text: "Profile", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/medz" }],
  },
});
