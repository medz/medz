import { defineConfig } from "vitepress";
import tailwindcss from "@tailwindcss/vite";

const social = { github: "medz", x: "shiweidu" },
  title = `Seven Du, GitHub: @${social.github} · X: @${social.x}`,
  description = `I'm Seven Du, an Open Source Entrepreneur and Founder of Odroe Inc. Since 2025, also serving as Engineer at Panony, responsible for PANews. GitHub: @${social.github} · X: @${social.x}`;

export default defineConfig({
  vite: { plugins: [tailwindcss()] },
  srcExclude: ["README.md"],

  title,
  description,
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

    ["meta", { name: "twitter:site", content: `@${social.x}` }],
    ["meta", { name: "twitter:creator", content: `@${social.x}` }],
    ["meta", { name: "twitter:card", content: "summary" }],
    [
      "meta",
      {
        name: "twitter:image",
        content: "https://medz.dev/photo.jpeg",
      },
    ],
    ["meta", { name: "twitter:title", content: title }],
    ["meta", { name: "twitter:description", content: description }],

    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: title }],
    ["meta", { property: "og:description", content: description }],
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
    socialLinks: [
      { icon: "github", link: `https://github.com/${social.github}` },
      { icon: "x", link: `https://x.com/${social.x}` },
    ],
  },
});
