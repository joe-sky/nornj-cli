import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import opn from 'opn';
import pxToRem from 'postcss-pxtorem';
import { lessModifyVars } from './configs';

const useBrowser = process.env.BROWSER != 'none';

export default {
  mode: 'development',
  entry: {
    vendor: [
      './src/utils/polyfills.js',
      'react',
      'react-dom',
      'react-router',
      'mobx',
      'mobx-react',
      'mobx-state-tree',
      'nornj',
      'nornj-react'
    ],
    app: ['react-hot-loader/patch', './src/main.js']
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/dist/',
    filename: `js/[name].js`,
    chunkFilename: `js/[name].chunk.js`
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
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
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              minimize: false,
              sourceMap: true
            }
          },
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: lessModifyVars
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
        test: /\.(t|nj)\.html(\?[\s\S]+)*$/,
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
        test: /\.html(\?[\s\S]+)*$/,
        use: [
          {
            loader: 'nornj-loader'
          }
        ],
        exclude: /\.(t|nj)\.html$/
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[hash:8][name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        use: ['url-loader?limit=10000&name=fonts/[name].[ext]?[hash]']
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
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
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
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      filename: `css/[name].css`,
      chunkFilename: `css/[name].css`
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
  ]
};
