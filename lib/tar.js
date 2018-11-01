'use strict';

const { getTemplatePath } = require('./utils');
const targz = require('targz');

targz.compress(
  {
    src: getTemplatePath(true) + 'react-mobx',
    dest: getTemplatePath() + 'react-mobx.tar.gz'
  },
  function(err) {
    if (err) {
      console.log(err);
    }

    console.log('react-mobx.tar.gz create completed!');
  }
);

targz.compress(
  {
    src: getTemplatePath(true) + 'react-mst',
    dest: getTemplatePath() + 'react-mst.tar.gz'
  },
  function(err) {
    if (err) {
      console.log(err);
    }

    console.log('react-mst.tar.gz create completed!');
  }
);

targz.compress(
  {
    src: getTemplatePath(true) + 'react-mst-universal',
    dest: getTemplatePath() + 'react-mst-universal.tar.gz'
  },
  function(err) {
    if (err) {
      console.log(err);
    }

    console.log('react-mst-universal.tar.gz create completed!');
  }
);

targz.compress(
  {
    src: getTemplatePath(true) + 'react-mst-app',
    dest: getTemplatePath() + 'react-mst-app.tar.gz'
  },
  function(err) {
    if (err) {
      console.log(err);
    }

    console.log('react-mst-app.tar.gz create completed!');
  }
);
