const webpack = require('webpack'),
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const isProd = process.env.NODE_ENV == 'production';
const isTest = process.env.NODE_ENV == 'test';
const isLocal = process.env.Project == 'local';
const pxToRem = require('postcss-pxtorem');
const VERSION = '20170928';
const modifyVars = Object.assign({});

module.exports = {
  entry: {
    app: ['react-hot-loader/patch', path.resolve(__dirname, './app-' + (!isLocal ? process.env.Project : 'web') + '.js')],
    vendor: ['./src/utils/vendorIndex.js', 'react', 'react-dom', 'react-router', 'mobx', 'mobx-react', 'mobx-state-tree', 'nornj', 'nornj-react', 'core-decorators']
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    publicPath: (isProd || isTest) ? (!isLocal ? '' : '../') : '/dist/',
    filename: process.env.Project + `/${VERSION}/[name].js`,
    chunkFilename: process.env.Project + `/${VERSION}/[name].chunk.js`
  },
  resolve: {
    alias: {
      'react/lib/Object.assign': 'object-assign'
    },
    extensions: ['.web.js', '.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.less']
  },
  module: {
    rules: [{
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader?cacheDirectory',
            options: {
              presets: ['react', ['es2015', { modules: false }], 'es2016'],
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
        use: [{
          loader: 'babel-loader?cacheDirectory',
          options: {
            plugins: ['external-helpers']
          }
        }],
        exclude: /node_modules/
      },
      // {
      //   test: /\.(js|jsx)$/,
      //   enforce: 'pre',
      //   use: ['eslint-loader'],
      //   include: /src/,
      // },
      {
        test: /\.t.html(\?[\s\S]+)*$/,
        use: [{
          loader: 'nornj-loader',
          options: {
            outputH: true,
            delimiters: 'react',
            extensionConfig: require('nornj-react/mobx/extensionConfig')
          }
        }]
      },
      {
        test: /\.template(-[\s\S]+)*.html(\?[\s\S]+)*$/,
        use: [{
          loader: 'nornj-loader'
        }]
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "postcss-loader"
        }, {
          loader: "sass-loader"
        }],
        exclude: /.m.scss$/
      },
      {
        test: /\.m.scss$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader",
          options: {
            modules: true,
            localIdentName: '[name]__[local]-[hash:base64:5]'
          }
        }, {
          loader: "postcss-loader"
        }, {
          loader: "sass-loader"
        }]
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              minimize: (isProd || isTest),
              sourceMap: !isProd
            }
          }, 'postcss-loader', {
            loader: 'less-loader',
            options: {
              "modifyVars": modifyVars
            }
          }]
        }),
        exclude: /.m.less$/
      },
      {
        test: /\.m.less$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: true,
            localIdentName: '[name]__[local]-[hash:base64:5]'
          }
        }, 'postcss-loader', 'less-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: ((isProd || isTest) ? '/' : '') + process.env.Project + '/images/[hash:8][name].[ext]'
          }
        }]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: ['url-loader?limit=10000&name=' + ((isProd || isTest) ? '/' : '') + process.env.Project + '/fonts/[name].[ext]?[hash]']
      }
    ]
  }
}


module.exports.plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: process.env.Project + `/${VERSION}/vendors.min.js`
  }),
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
    template: './index.template-' + (!isLocal ? process.env.Project : 'web') + '.nj.html',
    inject: 'true',
    chunks: ['vendor', 'app'],
    path: (isProd || isTest) ? (!isLocal ? process.env.Project + '/' : '') : `/dist/${process.env.Project}/`
  }),
  new HtmlWebpackPlugin({
    inject: 'true',
    chunks: ['vendor', 'appHome'],
    filename: process.env.Project + '/home.html',
    template: './index.template-' + (!isLocal ? process.env.Project : 'web') + '.nj.html',
    path: (isProd || isTest) ? (!isLocal ? process.env.Project + '/' : '') : `/dist/${process.env.Project}/`
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.DefinePlugin({
    __ENV: (isProd || isTest) ? "'pro'" : "'dev'",
    __HOST: (isProd || isTest) ? "''" : "'http://localhost:8089'",
    'process.env': {
      'NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
    }
  }),
  new CopyWebpackPlugin([{
    context: './src/vendor/',
    from: '*',
    to: path.join(__dirname, '/dist/' + process.env.Project + '/js/')
  }]),
  new ExtractTextPlugin({ filename: process.env.Project + `/css/${VERSION}/[name].css`, allChunks: true }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
];

if (isProd || isTest) {
  module.exports.plugins = (module.exports.plugins || []).concat([
    // new webpack.optimize.UglifyJsPlugin({
    //   compressor: {
    //     pure_getters: true,
    //     unsafe: true,
    //     unsafe_comps: true,
    //     screw_ie8: false,
    //     warnings: false
    //   },
    //   sourceMap: true
    // }),
    new UglifyJSPlugin({
      exclude: /node_modules/,
      sourceMap: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.ModuleConcatenationPlugin()
  ]);

  if (isTest) {
    module.exports.devtool = '#cheap-module-source-map'
  }
} else {
  module.exports.devtool = 'source-map'
}
