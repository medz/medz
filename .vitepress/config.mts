import { defineConfig } from "vitepress";

export default defineConfig({
  srcExclude: ["README.md"],
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
    ["meta", { name: "twitter:creator", content: "@shiweidu" }],
    ["meta", { name: "twitter:card", content: "summary" }],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://medz.dev/photo.jpeg",
      },
    ],
    ["meta", { name: "twitter:title", content: "Seven Du" }],
    ["meta", { name: "twitter:description", content: "Seven Du's Portfolio" }],

    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "Seven Du" }],
    ["meta", { property: "og:description", content: "Seven Du's Portfolio" }],
    ["meta", { property: "og:property", content: "Seven Du" }],
    ["meta", { property: "og:url", content: "https://medz.dev" }],
    ["meta", { property: "og:image", content: "https://medz.dev/photo.jpeg" }],
  ],
  sitemap: {
    hostname: "https://medz.dev",
    // transformItems(items) {
    //   return items.filter(({ url }) => url !== "README");
    // },
  },
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
