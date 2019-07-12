const webpack = require('webpack'),
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
  opn = require('opn');

const isProd = process.env.NODE_ENV == 'production';
const isTest = process.env.NODE_ENV == 'test';
const isLocal = process.env.Project == 'local';
const isRemote = process.env.Remote == 'true';
const useBrowser = process.env.BROWSER != 'none';
const pxToRem = require('postcss-pxtorem');
const VERSION = '20180829';

//修改主题颜色
const appTheme = process.env.Project === 'app' ? require('./src/app/config/theme') : {};
const modifyVars = Object.assign({}, appTheme);

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    vendor: [
      './src/utils/vendorIndex.js',
      'react',
      'react-dom',
      'react-router',
      'mobx',
      'mobx-react',
      'mobx-state-tree',
      'nornj',
      'nornj-react',
      'core-decorators'
    ],
    app: [
      './src/utils/vendorIndex.js',
      'react-hot-loader/patch',
      path.resolve(__dirname, './app.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: isProd || isTest ? (!isLocal ? '' : '../') : '/dist/',
    filename: process.env.Project + `/${VERSION}/[name].js`,
    chunkFilename: process.env.Project + `/${VERSION}/[name].chunk.js`
  },
  resolve: {
    alias: {
      'react/lib/Object.assign': 'object-assign'
    },
    extensions: ['.web.js', '.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.less']
  },
  devServer: {
    port: 8080,
    proxy: {
      '/remoteServer': {
        target: 'http://localhost:8088/',
        secure: false,
        changeOrigin: true
      }
    },
    after: () => {
      useBrowser && opn('http://localhost:8080/dist/app');
    }
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                [
                  '@babel/preset-env',
                  {
                    modules: false
                  }
                ]
              ],
              // plugins: ['transform-runtime', 'transform-class-properties']
              cacheDirectory: true
            }
          },
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['@babel/external-helpers'],
              cacheDirectory: true
            }
          }
        ],
        exclude: /node_modules/
      },
      // {
      //   test: /\.(js|jsx)$/,
      //   enforce: 'pre',
      //   use: ['eslint-loader'],
      //   include: /src/,
      // },
      {
        test: /\.t\.html(\?[\s\S]+)*$/,
        use: [
          {
            loader: 'nornj-loader',
            options: {
              outputH: true,
              delimiters: 'react',
              extensionConfig: require('nornj-react/mobx/extensionConfig')
            }
          }
        ]
      },
      {
        test: /\.template(-[\s\S]+)*\.nj\.html(\?[\s\S]+)*$/,
        use: [
          {
            loader: 'nornj-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: isProd || isTest,
              sourceMap: !isProd
            }
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: modifyVars
            }
          }
        ],
        exclude: /\.m\.less$/
      },
      {
        test: /\.m\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]-[hash:base64:5]'
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: (isProd || isTest ? '/' : '') + process.env.Project + '/images/[hash:8][name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(svg)$/i,
        loader: 'svg-sprite-loader',
        include: [
          require.resolve('antd-mobile').replace(/warn\.js$/, ''),
          path.resolve(__dirname, 'src/app/images')
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          'url-loader?limit=10000&name=' +
            (isProd || isTest ? '/' : '') +
            process.env.Project +
            '/fonts/[name].[ext]?[hash]'
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          name: 'vendor',
          test: 'vendor',
          enforce: true
        },
        styles: {
          name: 'styles',
          test: /\.less$/,
          chunks: 'all',
          priority: 20,
          enforce: true
        }
      }
    },
    minimizer: [
      new UglifyJSPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true,
            dead_code: true
          },
          output: {
            comments: false
          }
        }
        // sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
};

module.exports.plugins = [
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: [
        pxToRem({
          rootValue: 100,
          propWhiteList: [],
          mediaQuery: true
        })
      ]
    }
  }),
  new HtmlWebpackPlugin({
    filename: process.env.Project + '/index.html',
    template: './index.template-' + (!isLocal ? process.env.Project : 'app') + '.nj.html',
    inject: 'true',
    // chunks: ['vendor', 'styles', 'app'],
    path: isProd || isTest ? (!isLocal ? process.env.Project + '/' : '') : `/dist/${process.env.Project}/`
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.DefinePlugin({
    __ENV: isProd || isTest ? "'pro'" : "'dev'",
    __HOST: isProd || isTest ? "''" : !isRemote ? "'http://localhost:8089'" : "'http://localhost:8080'",
    __Remote: isRemote, // true: 使用后端服务器接口 | false: 使用本地mock server
    'process.env': {
      NODE_ENV: JSON.stringify(isProd ? 'production' : 'development')
    }
  }),
  new CopyWebpackPlugin([
    {
      context: './src/vendor/',
      from: '*',
      to: path.join(__dirname, '/dist/' + process.env.Project + '/js/')
    }
  ]),
  new MiniCssExtractPlugin({
    filename: process.env.Project + `/css/${VERSION}/[name].css`,
    chunkFilename: process.env.Project + `/css/${VERSION}/[name].css`
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
];

if (isProd || isTest) {
  if (isTest) {
    module.exports.devtool = '#cheap-module-source-map';
  }
} else {
  module.exports.devtool = 'source-map';
}
