import webpack from 'webpack';
import merge from 'webpack-merge';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import opn from 'opn';
import webpackConfigBase from './webpack.config.base';
import { dev, proxy, mock, lessModifyVars } from './configs';

const useBrowser = process.env.BROWSER != 'none';

export default merge.smart(webpackConfigBase, {
  mode: 'development',
  output: {
    publicPath: '/dist/'
  },
  devServer: {
    host: '0.0.0.0',
    port: dev.port,
    proxy: {
      '/remoteServer': {
        target: `${proxy.protocol}://${proxy.host}:${proxy.port}/`,
        secure: false,
        changeOrigin: true
      }
    },
    after: () => {
      useBrowser && opn(`http://${dev.host}:${dev.port}/dist/`);
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
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
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      inject: true,
      path: '/dist/'
    }),
    new webpack.DefinePlugin({
      __HOST: `'${mock.protocol}://${mock.host}:${mock.port}'`,
      'process.env': {
        NODE_ENV: `'development'`
      }
    })
  ]
});
