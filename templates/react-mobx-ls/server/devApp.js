'use strict';

const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const nj = require('nornj');
const njExpressEngine = require('nornj/tools/expressEngine');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const configs = require('../configs');
const app = express();

//启动webpack dev server
if (app.get('env') === 'webpack') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack.config');
  const _webpackConfig = webpackConfig(webpack, configs.local, false, false, true);
  const compiler = webpack(_webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    // noInfo: true,
    // quiet: true,
    publicPath: _webpackConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler, {
    log: () => {}
  }));
}

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//设置Express模板引擎
app.engine('html', njExpressEngine({
  delimiters: {
    start: '{%',
    end: '%}',
    extension: '$',
    prop: '##'
  },
  defaultLayout: <#-if #{useLayout}#>'default'<#-else>null</#-else></#-if>,
  layoutsDir: 'layout/'
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

//设置跨域访问
app.all('*', function(req, res, next) {
  //res.header("Access-Control-Allow-Origin", "http://localhost:3004");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get('/', function(req, res) {
  res.redirect('/index');
});

app.get('/index', function(req, res) {
  res.type('html');
  res.render('index');
});

app.get('/page1', function(req, res) {
  res.type('html');
  res.render('page1', { page: 'page1/', title: 'Page 1' });
});

app.get('/page2', function(req, res) {
  res.type('html');
  res.render('page2', { page: 'page2/', title: 'Page 2' });
});

app.get('/checkUser', function(req, res) {
  res.type('html');
  res.sendFile('views/checkUser.html', { root: __dirname });
});

let server = app.listen(configs.devPort, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});