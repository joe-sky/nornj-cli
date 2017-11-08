'use strict';

const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const configs = require('../configs');
const app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:" + configs.local.bs.port);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

const { resultData } = require('./common/utils');

//载入路由
const page1 = require('./routes/page1');
app.use('/page1', page1);
const page2 = require('./routes/page2');
app.use('/page2', page2);

app.post('/common/getLoginInfo', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: 'test_user'
  });

  res.send(ret);
});

let server = app.listen(configs.port, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});