const express = require('express');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { dev, mock } = require('../config/configs');
const app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', `http://${dev.host}:${dev.port}`);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');
  if (req.method == 'OPTIONS') res.sendStatus(200);
  else next();
});

const defaultExample = require('./routes/defaultExample');
app.use('/defaultExample', defaultExample);

const chartExample = require('./routes/chartExample');
app.use('/chartExample', chartExample);

const formExample = require('./routes/formExample');
app.use('/formExample', formExample);

const emptyExample = require('./routes/emptyExample');
app.use('/emptyExample', emptyExample);

//{pages}//

const { resultData } = require('./common/utils');

app.get('/', function(req, res) {
  res.redirect('/index');
});

app.get('/index', function(req, res) {
  res.type('html');
  res.render('index');
});

app.get('/checkUser', function(req, res) {
  res.type('html');
  res.sendFile('views/checkUser.html', { root: __dirname });
});

app.get('/common/getLoginInfo', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: 'test_user'
  });

  res.send(ret);
});

app.post('/common/getCurrentUserInfo', function(req, res) {
  res.type('json');
  let ret = {};

  Object.assign(ret, resultData, {
    data: {
      pin: 'testUser',
      name: 'testUser'
    },
    success: true
  });

  res.send(ret);
});

app.get('/common/logout', function(req, res) {
  res.redirect(`http://${dev.localhost}:${dev.port}/dist/home.html`);
});

let server = app.listen(mock.port, function() {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
