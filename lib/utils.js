'use strict';

const globalModules = require('global-modules');
const config = require('../config.json');
const fs = require('fs');
const nj = require('nornj').default;

function getTemplatePath(notSourceFile) {
  return (config.global ? (globalModules + '/nornj-cli/templates/') : './templates/') + (notSourceFile ? '' : 'sourceFiles/');
}

function deleteFolder(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolder(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function renderFile(path, pathTo, ...params) {
  fs.writeFileSync(pathTo != null ? pathTo : path, nj.render(fs.readFileSync(path, 'utf-8'), ...params));
}

module.exports = {
  getTemplatePath,
  deleteFolder,
  renderFile
};