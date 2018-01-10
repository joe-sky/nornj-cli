'use strict';

const { getTemplatePath } = require('./utils');
const targz = require('targz');

targz.compress({
  src: getTemplatePath(true) + 'react-mobx',
  dest: getTemplatePath() + 'react-mobx.tar.gz'
}, function(err) {
  if (err) {
    console.log(err);
  }
});

targz.compress({
  src: getTemplatePath(true) + 'react-mst',
  dest: getTemplatePath() + 'react-mst.tar.gz'
}, function(err) {
  if (err) {
    console.log(err);
  }
});