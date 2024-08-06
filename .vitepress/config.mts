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
  sitemap: { hostname: "https://medz.dev" },
  themeConfig: {
    logo: "/favicon.png",
    siteTitle: false,
    nav: [
      // { text: "Profile", link: "/" },
      // { text: "Blog", link: "/blog" },
      // { text: "Projects", link: "/projects" },
      // { text: "Meeting", link: "/meeting" },
      // { text: "Sponsors", link: "/sponsors" },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/medz" }],
  },
});
