export const resume = {
  summary: {
    en: 'Full-stack engineer and open-source founder based in Chengdu, China. My work spans community platforms, media publishing systems, and developer tools. I build software from API design through implementation, documentation, and release, with a focus on clear interfaces, runtime performance, and practical operating costs.',
    zh: '常驻成都的全栈工程师与开源创业者，工作横跨社区平台、媒体出版系统与开发者工具。从 API 设计到实现、文档和发布，持续参与软件的完整生命周期，关注清晰的接口、运行时性能与实际运维成本。',
  },
  experience: [
    {
      organization: 'Panony / PANews',
      url: 'https://www.panewslab.com',
      start: '2025',
      end: null,
      role: { en: 'Software Engineer', zh: '软件工程师' },
      highlights: {
        en: [
          'Develop backend APIs and Cloudflare Workers services for the multilingual PANews media platform.',
          'Migrated editorial content to Markdown while preserving API contracts and compatibility with existing clients.',
          'Work on content ingestion, translation, authentication, and service integrations to support reliable publishing workflows.',
        ],
        zh: [
          '负责 PANews 多语言媒体平台的后端 API 与 Cloudflare Workers 服务开发。',
          '将编辑内容迁移至 Markdown，保留既有 API 契约及客户端兼容性。',
          '建设内容采集、翻译、身份验证与服务集成，支持稳定的内容发布流程。',
        ],
      },
    },
    {
      organization: 'Odroe Inc.',
      url: 'https://github.com/odroe',
      start: '2019',
      end: null,
      role: { en: 'Founder & Open-source Developer', zh: '创始人 · 开源开发者' },
      highlights: {
        en: [
          'Build and maintain open-source tools for the Dart ecosystem, covering data access, portable servers, reactivity, and native interoperability.',
          'Created Prisma Dart and continue developing typed database tooling and libraries used by other Dart projects.',
          'Own API design, implementation, tests, documentation, and releases; support users and downstream maintainers through public repositories.',
        ],
        zh: [
          '建设并维护 Dart 生态开源工具，覆盖数据访问、跨运行时服务、响应式系统与原生互操作。',
          '创建 Prisma Dart，持续开发类型安全的数据库工具与供其他 Dart 项目使用的基础库。',
          '负责 API 设计、实现、测试、文档和版本发布，通过公开仓库支持使用者与下游维护者。',
        ],
      },
    },
    {
      organization: '智艺创想',
      url: null,
      start: '2015',
      end: '2019',
      role: { en: 'Chief Technology Officer · Chengdu', zh: '首席技术官 · 成都' },
      highlights: {
        en: [
          'Led technical delivery and the architecture and maintenance of ThinkSNS, a social networking platform.',
          'Led backend and administration-system development for Zhejiang Satellite TV’s China Blue application.',
          'Delivered community platforms for Huawei Xinsheng, Huawei Weibo, and Midea Group.',
        ],
        zh: [
          '负责技术交付与团队技术工作，主导 ThinkSNS 社交平台的架构设计和维护。',
          '主导浙江卫视「中国蓝」App 后端与管理系统开发。',
          '交付华为心声社区、华为微博及美的集团社区平台等项目。',
        ],
      },
    },
  ],
  projects: [
    {
      name: 'Prisma Dart / Dart ORM',
      url: 'https://github.com/medz/dart-orm',
      category: { en: 'Database tooling', zh: '数据库工具' },
      description: {
        en: 'Created Prisma Dart to bring generated, type-safe database access to Dart; continue evolving the project as Dart ORM.',
        zh: '创建 Prisma Dart，将代码生成与类型安全的数据访问带入 Dart，并持续将项目演进为 Dart ORM。',
      },
      highlights: {
        en: [
          'Model definitions and generated query APIs keep database operations visible to the Dart type system.',
          'Develop native SQLite and PostgreSQL access, explicit transaction boundaries, and reviewable schema migrations.',
        ],
        zh: [
          '通过模型定义与生成的查询 API，让数据库操作接受 Dart 类型系统检查。',
          '开发原生 SQLite、PostgreSQL 访问，明确的事务边界与可审阅的数据库迁移。',
        ],
      },
    },
    {
      name: 'napi',
      url: 'https://github.com/medz/napi',
      category: { en: 'Dart / Node-API interoperability', zh: 'Dart / Node-API 互操作' },
      description: {
        en: 'Build native Node.js addons from Dart, connecting Dart libraries to the JavaScript ecosystem through Node-API.',
        zh: '使用 Dart 构建 Node.js 原生扩展，通过 Node-API 将 Dart 库接入 JavaScript 生态。',
      },
      highlights: {
        en: [
          'Provide annotated exports, typed value conversion, native resource ownership, and asynchronous interoperability.',
          'Package platform build tooling and generate TypeScript declarations alongside native addons.',
        ],
        zh: [
          '提供注解导出、类型转换、原生资源所有权管理与异步互操作。',
          '提供平台构建工具链，并为原生扩展生成 TypeScript 类型声明。',
        ],
      },
    },
    {
      name: 'Alien Signals Dart',
      url: 'https://github.com/medz/alien-signals-dart',
      category: { en: 'Reactive systems', zh: '响应式系统' },
      description: {
        en: 'Maintain a Dart implementation of the reactive algorithm from StackBlitz’s Alien Signals, with signal, computed, and effect APIs.',
        zh: '基于 StackBlitz Alien Signals 算法实现并维护 Dart 响应式内核，提供 signal、computed 与 effect API。',
      },
      highlights: {
        en: [
          'Work on dependency propagation, lazy evaluation, batching, effect scopes, and cleanup semantics.',
          'Maintain regression coverage and runnable API examples; support downstream projects including Solidart and Oref.',
        ],
        zh: [
          '完善依赖传播、惰性求值、批处理、effect 作用域与清理语义。',
          '维护回归验证与可运行的 API 示例，支持 Solidart、Oref 等下游项目。',
        ],
      },
    },
    {
      name: 'Spry',
      url: 'https://github.com/medz/spry',
      category: { en: 'Portable web servers', zh: '跨运行时 Web 服务' },
      description: {
        en: 'Develop a file-routed Dart server framework with explicit build outputs for multiple deployment targets.',
        zh: '开发采用文件路由的 Dart 服务端框架，为不同部署目标生成明确、可检查的构建产物。',
      },
      highlights: {
        en: [
          'Generate runtime adapters for Dart VM, Node.js, Bun, Deno, and edge environments.',
          'Connect route definitions to generated OpenAPI documents and typed clients.',
        ],
        zh: [
          '为 Dart VM、Node.js、Bun、Deno 与边缘运行环境生成适配代码。',
          '从路由定义生成 OpenAPI 文档与类型安全的客户端。',
        ],
      },
    },
    {
      name: 'dartc',
      url: 'https://github.com/medz/dartc',
      category: { en: 'Compiler research · Early preview', zh: '编译器研究 · 早期预览' },
      description: {
        en: 'Explore a native Dart compiler written in Dart, spanning language semantics, executable generation, and bootstrap workflows.',
        zh: '探索使用 Dart 编写的原生 Dart 编译器，涵盖语言语义、可执行文件生成与自举流程。',
      },
      highlights: {
        en: [
          'Develop ARM64 code generation for macOS and Linux and the runtime foundations needed to execute Dart programs.',
          'Use staged bootstrap and behavior regressions to validate progress; complete Dart compatibility remains ongoing work.',
        ],
        zh: [
          '开发面向 macOS 和 Linux 的 ARM64 代码生成，以及执行 Dart 程序所需的运行时基础。',
          '通过分阶段自举与行为回归验证进展，完整 Dart 兼容性仍在持续建设中。',
        ],
      },
    },
  ],
  skills: [
    { label: { en: 'Languages', zh: '编程语言' }, value: 'Dart · TypeScript · JavaScript · PHP' },
    { label: { en: 'Web & mobile', zh: 'Web 与移动端' }, value: 'Flutter · Vue / Nuxt · React / Next.js · SvelteKit' },
    { label: { en: 'Backend & data', zh: '后端与数据' }, value: 'Node.js · H3 / Nitro · PostgreSQL · SQLite · Prisma' },
    { label: { en: 'Infrastructure', zh: '基础设施' }, value: 'Cloudflare Workers · Docker · GitHub Actions · Native / WebAssembly' },
  ],
};
