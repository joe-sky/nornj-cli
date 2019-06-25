module.exports = {
  locales: {
    '/': {
      lang: 'en-US',
      title: 'NornJ CLI',
      description: '🛠️ An Easily Configurable and Scalable Scaffolding tool'
    },
    '/zh/': {
      lang: 'zh-CN',
      title: 'NornJ CLI',
      description: '🛠️ 一套可配置化、易于扩展的脚手架工具'
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  base: '/nornj-cli/',
  themeConfig: {
    repo: 'joe-sky/nornj-cli',
    docsDir: 'docs',
    //docsBranch: 'docs',
    editLinks: true,
    sidebarDepth: 3,
    algolia: {
      indexName: 'cli_vuejs',
      apiKey: 'f6df220f7d246aff64a56300b7f19f21'
    },
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        lastUpdated: 'Last Updated',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'Config Reference',
            link: '/config/'
          },
          {
            text: 'Plugin Dev Guide',
            items: [
              { text: 'Plugin Dev Guide', link: '/dev-guide/plugin-dev.md' },
              { text: 'UI Plugin Info', link: '/dev-guide/ui-info.md' },
              { text: 'UI Plugin API', link: '/dev-guide/ui-api.md' },
              { text: 'UI Localization', link: '/dev-guide/ui-localization.md' }
            ]
          },
          {
            text: 'Plugins',
            link: '/core-plugins/'
          },
          {
            text: 'Changelog',
            link: 'https://github.com/vuejs/vue-cli/blob/dev/CHANGELOG.md'
          }
        ],
        sidebar: {
          '/guide/': [
            '/guide/',
            '/guide/installation',
            {
              title: 'Basics',
              collapsable: false,
              children: [
                '/guide/prototyping',
                '/guide/creating-a-project',
                '/guide/plugins-and-presets',
                '/guide/cli-service'
              ]
            },
            {
              title: 'Development',
              collapsable: false,
              children: [
                '/guide/browser-compatibility',
                '/guide/html-and-static-assets',
                '/guide/css',
                '/guide/webpack',
                '/guide/mode-and-env',
                '/guide/build-targets',
                '/guide/deployment',
                '/guide/troubleshooting'
              ]
            }
          ],
          '/dev-guide/': [
            '/dev-guide/plugin-dev.md',
            {
              title: 'API reference',
              collapsable: false,
              children: ['/dev-guide/plugin-api.md', '/dev-guide/generator-api.md']
            },
            {
              title: 'UI Development',
              collapsable: false,
              children: ['/dev-guide/ui-info.md', '/dev-guide/ui-api.md', '/dev-guide/ui-localization.md']
            }
          ],
          '/core-plugins/': [
            {
              title: 'Core Vue CLI Plugins',
              collapsable: false,
              children: [
                '/core-plugins/babel.md',
                '/core-plugins/typescript.md',
                '/core-plugins/eslint.md',
                '/core-plugins/pwa.md',
                '/core-plugins/unit-jest.md',
                '/core-plugins/unit-mocha.md',
                '/core-plugins/e2e-cypress.md',
                '/core-plugins/e2e-nightwatch.md'
              ]
            }
          ]
        }
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        lastUpdated: '上次编辑时间',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: '指南',
            link: '/zh/guide/installation'
          },
          {
            text: '配置参考',
            link: '/zh/config/'
          },
          {
            text: '扩展开发指南',
            link: '/zh/dev-guide/'
          },
          {
            text: '更新记录',
            link: 'https://github.com/joe-sky/nornj-cli/blob/master/CHANGELOG.md'
          }
        ],
        sidebar: {
          '/zh/guide/': [
            //'/zh/guide/',
            '/zh/guide/installation',
            {
              title: '基础',
              collapsable: false,
              children: [
                '/zh/guide/creating-a-project',
                '/zh/guide/preset-project-templates',
                '/zh/guide/creating-a-page',
                '/zh/guide/creating-a-component',
                '/zh/guide/creating-a-store',
                '/zh/guide/upgrade'
              ]
            },
            {
              title: '开发',
              collapsable: false,
              children: [
                '/zh/guide/browser-compatibility',
                '/zh/guide/html-and-static-assets',
                '/zh/guide/css',
                '/zh/guide/webpack',
                '/zh/guide/mode-and-env',
                '/zh/guide/build-targets',
                '/zh/guide/deployment'
              ]
            }
          ],
          '/zh/dev-guide/': [
            '/zh/dev-guide/plugin-dev.md',
            {
              title: 'UI 开发',
              collapsable: false,
              children: ['/zh/dev-guide/ui-info.md', '/zh/dev-guide/ui-api.md', '/zh/dev-guide/ui-localization.md']
            }
          ]
        }
      }
    }
  }
};
