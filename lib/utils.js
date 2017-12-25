'use strict';

const globalModules = require('global-modules');
const fs = require('fs');
const nj = require('nornj').default;
const mkdirp = require('mkdirp');
const _ = require('lodash');
const path = require('path');

function getTemplatePath() {
  return getRootPath() + 'templates/';
}

function getRootPath() {
  return path.resolve(__dirname, '..').replace(/\\/g, '/') + '/';
  //return globalModules + '/nornj-cli/';
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
  let fileTxt = nj.render(fs.readFileSync(path, 'utf-8'), ...params);
  let configs = {};
  if (params && params.length) {
    configs = params[0];
  }

  if (configs.clear) {
    fileTxt = fileTxt.replace(configs.clear, '');
  }

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

function getDeps(pkg) {
  const deps = [];
  const privateDeps = pkg.njCliConfig.privateLib.split(/\s+/);
  pkg.dependencies && Object.keys(pkg.dependencies).forEach(dep => {
    if (privateDeps.indexOf(dep) < 0) {
      deps.push(dep);
    }
  });
  pkg.devDependencies && Object.keys(pkg.devDependencies).forEach(dep => {
    if (privateDeps.indexOf(dep) < 0) {
      deps.push(dep);
    }
  });

  return deps;
}

module.exports = {
  getTemplatePath,
  getRootPath,
  deleteFolder,
  renderFile,
  renderAppendFile,
  getDeps
};