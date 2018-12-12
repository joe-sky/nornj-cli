module.exports = {
  presets: ['@babel/preset-react'],
  env: {
    development: {
      presets: ['@babel/preset-env']
    },
    production: {
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false
          }
        ]
      ]
    },
    test: {
      presets: ['@babel/preset-env'],
      plugins: [
        [
          'nornj-loader',
          {
            extensions: ['.t.html']
          }
        ]
      ]
    }
  },
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    [
      'import',
      {
        libraryName: 'antd',
        style: true
      },
      'antd'
    ],
    [
      'import',
      {
        libraryName: 'flarej',
        libraryDirectory: 'lib/components',
        style: true
      },
      'fj'
    ],
    [
      'import',
      {
        libraryName: 'flarej/antd',
        customName: name => `flarej/lib/components/antd/${name[0].toLowerCase() + name.substr(1)}/component`,
        camel2DashComponentName: false,
        style: true
      },
      'fj-antd'
    ],
    [
      'import',
      {
        libraryName: 'flarej/echarts',
        customName: name => `flarej/lib/components/ECharts/${name[0].toLowerCase() + name.substr(1)}`,
        camel2DashComponentName: false
      },
      'fj-echarts'
    ],
    [
      'import',
      {
        libraryName: 'flarej/element',
        customName: name => `flarej/lib/components/element/${name[0].toLowerCase() + name.substr(1)}/component`,
        camel2DashComponentName: false,
        style: true
      },
      'fj-element'
    ],
    [
      'styled-jsx/babel',
      {
        plugins: ['styled-jsx-plugin-sass', 'styled-jsx-plugin-postcss']
      }
    ],
    [
      'nornj-in-jsx',
      {
        imports: ['flarej', 'flarej/antd', 'flarej/echarts', 'flarej/element']
      }
    ],
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-json-strings',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: true
      }
    ],
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-object-assign',
    [
      '@babel/plugin-transform-classes',
      {
        loose: true
      }
    ],
    [
      '@babel/plugin-transform-for-of',
      {
        loose: true
      }
    ],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-logical-assignment-operators',
    '@babel/plugin-proposal-optional-chaining',
    [
      '@babel/plugin-proposal-pipeline-operator',
      {
        proposal: 'minimal'
      }
    ],
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-external-helpers',
    '@babel/plugin-transform-runtime'
  ]
};
