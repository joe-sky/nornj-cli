'use strict';

const path = require('path');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const modifyVars = Object.assign({});

//需要webpack排除的依赖包
const webpackExternals = {
  'jquery': {
    root: '$',
    commonjs2: 'jquery',
    commonjs: 'jquery',
    amd: 'jquery'
  }
};

module.exports = function(webpack, config, isProd, useWatch, useHmr) {
  //获取需要打包的文件
  let needExtractCommons = [],
    entrys = { common: ['./src/common/indexConfig', 'react', 'react-dom', 'mobx', 'mobx-react', 'nornj', 'nornj-react', 'core-decorators'] }
  glob.sync('./src/pages/**/container.js', { ignore: null }).forEach(file => {
    let path = file.substring(file.indexOf("pages/"), file.lastIndexOf("."));

    if (!/\/index$/.test(path)) {
      needExtractCommons.push(path);
      entrys[path] = useHmr ? ['webpack-hot-middleware/client', './src/' + path + '.js'] : './src/' + path + '.js';
    } else {
      entrys[path] = './src/' + path + '.js';
    }
  });

  //配置插件
  let plugins = [
    new webpack.DefinePlugin({
      G_VER: JSON.stringify(isProd ? config.ver : 'random'),
      G_WEB_DOMAIN: JSON.stringify(config.webDomain),
      'process.env': {
        'NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      // (the commons chunk name)

      filename: 'common.js',
      // (the filename of the commons chunk)

      minChunks: 4,
      // (Modules must be shared between 3 entries)

      chunks: needExtractCommons,
      // (Only use these entries)
    }),
    new ExtractTextPlugin({ filename: 'css/[name].css', allChunks: true }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    new webpack.LoaderOptionsPlugin({
      // test: /\.xxx$/, // may apply this only for some modules
      options: {
        postcss: [autoprefixer({ browsers: ['last 50 versions'] })]
      }
    })
  ];

  if (isProd) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: false,
        warnings: false
      },
      sourceMap: true
    }));
  }
  if (useHmr) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return {
    //devtool: isProd ? 'source-map' : false,
    devtool: 'source-map',
    watch: useWatch,
    externals: webpackExternals,
    entry: entrys,
    output: {
      //path: path.join(__dirname, 'server/public/resources/app'),
      filename: '[name].js',
      library: 'Global_[name]',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      publicPath: '/resources/app/'
    },
    module: {
      rules: [{
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              options: {
                minimize: isProd,
                sourceMap: isProd
              }
            }]
          }),
        },
        {
          test: /\.less$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              options: {
                minimize: isProd,
                sourceMap: isProd
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
          test: /\.js$/,
          use: [{
            loader: 'babel-loader',
            options: {
              plugins: ['external-helpers']
            }
          }],
          exclude: /node_modules/
        },
        {
          test: /\.t.html(\?[\s\S]+)*$/,
          use: [{
            loader: 'nornj-loader',
            options: {
              outputH: true,
              delimiters: 'react'
            }
          }]
        },
        {
          test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'fonts/[hash:8][name].[ext]'
            }
          }]
        },
        {
          test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
          use: [{
            loader: 'file-loader',
            options: {
              limit: 8192,
              name: 'fonts/[hash:8][name].[ext]'
            }
          }]
        },
        {
          test: /\.(jpe?g|png|gif|ico)$/,
          use: [{
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[hash:8][name].[ext]'
            }
          }]
        }
      ],
    },
    resolve: {
      extensions: ['.js', '.css', '.less']
    },
    plugins
  };
};