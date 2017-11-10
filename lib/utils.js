'use strict';

const globalModules = require('global-modules');
const config = require('../config.json');
const fs = require('fs');
const nj = require('nornj').default;
const mkdirp = require('mkdirp');
const _ = require('lodash');

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
  const fileTxt = nj.render(fs.readFileSync(path, 'utf-8'), ...params);
  if (pathTo != null) {
    const pathToDir = pathTo.substr(0, pathTo.lastIndexOf('/'));
    if (!fs.existsSync(pathToDir)) {
      mkdirp.sync(pathToDir);
    }
  }
  
  fs.writeFileSync(pathTo != null ? pathTo : path, fileTxt);
}

function renderAppendFile(path, pathTo, newLines, ...params) {
  const fileTxt = nj.render(fs.readFileSync(path, 'utf-8'), ...params);
  fs.appendFileSync(pathTo != null ? pathTo : path, _.times(newLines, i => '\n').join('') + fileTxt.trim());
}

module.exports = {
  getTemplatePath,
  deleteFolder,
  renderFile,
  renderAppendFile
};