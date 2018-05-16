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

  console.log('react-mobx.tar.gz create completed !');
});

targz.compress({
  src: getTemplatePath(true) + 'react-mst',
  dest: getTemplatePath() + 'react-mst.tar.gz'
}, function(err) {
  if (err) {
    console.log(err);
  }

  console.log('react-mst.tar.gz create completed !');
});

targz.compress({
  src: getTemplatePath(true) + 'react-mst-jsx',
  dest: getTemplatePath() + 'react-mst-jsx.tar.gz'
}, function(err) {
  if (err) {
    console.log(err);
  }

  console.log('react-mst-jsx.tar.gz create completed !');
});