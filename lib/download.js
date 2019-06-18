'use strict';

const fetch = require('isomorphic-fetch');
const fs = require('fs');

function getLatestTarball(url) {
  return fetch(url).then(async res => {
    const text = await res.text();
    const tarball = text.match(/"(.+\.tgz)"/g);
    return tarball[0].replace(/"/g, '');
  });
}

function downloadTemplate(url, projectName) {
  return fetch(url).then(async res => {
    const { body } = res;
    const file = fs.createWriteStream(`${process.cwd()}/${projectName}`);
    body.pipe(file);
    return new Promise(resolve => {
      body.on('end', resolve);
    });
  });
}

module.exports = {
  getLatestTarball,
  downloadTemplate
};
