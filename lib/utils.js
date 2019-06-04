'use strict';

const globalModules = require('global-modules');
const fs = require('fs');
const nj = require('nornj/dist/nornj.common').default;
const mkdirp = require('mkdirp');
const _ = require('lodash');
const path = require('path');
const CNPM_REGISTRY = ' --registry https://registry.npm.taobao.org';

function getTemplatePath(notSourceFile) {
  return getRootPath() + 'templates/' + (notSourceFile ? '' : 'sourceFiles/');
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
      var curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteFolder(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function renderFile(path, pathTo, ...params) {
  let clearRegex;
  if (params && params.length && params[0]) {
    clearRegex = params[0].clearRegex;
    delete params[0].clearRegex;
  }

  let fileTxt = nj.render(fs.readFileSync(path, 'utf-8'), ...params);
  if (clearRegex) {
    fileTxt = fileTxt.replace(clearRegex, '');
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

function getDeps(pkg, hasPrivateLib) {
  const deps = [];
  const privateDeps =
    pkg.njCliConfig && pkg.njCliConfig.privateLib != null ? pkg.njCliConfig.privateLib.split(/\s+/) : [];
  const privateDepsVersion = {};

  pkg.dependencies &&
    Object.keys(pkg.dependencies).forEach(dep => {
      const index = privateDeps.indexOf(dep);
      if (index < 0) {
        deps.push(dep);
      } else {
        privateDepsVersion[index] = pkg.dependencies[dep].replace(/[~^]/g, '');
      }
    });
  pkg.devDependencies &&
    Object.keys(pkg.devDependencies).forEach(dep => {
      const index = privateDeps.indexOf(dep);
      if (index < 0) {
        deps.push(dep);
      } else {
        privateDepsVersion[index] = pkg.devDependencies[dep].replace(/[~^]/g, '');
      }
    });

  if (!hasPrivateLib) {
    return deps;
  } else {
    return {
      deps,
      privateDeps: privateDeps.length
        ? Object.keys(privateDepsVersion).map(i => {
            return privateDeps[i] + '@' + privateDepsVersion[i];
          })
        : null
    };
  }
}

function createParamsByTemplates(templates, initParams = {}, ...templateParams) {
  const params = Object.assign(
    {
      clearRegex: /<!--__extraComment__-->/g
    },
    initParams
  );

  Object.keys(templates).forEach(k => {
    if (k === 'clearRegex') {
      params[k] = new RegExp(templates[k].trim(), 'g');
    } else {
      params[k] = nj.render(templates[k].trim(), ...templateParams);
    }
  });

  return params;
}

function getResourceTemplateData(templateName, templates) {
  const ret = { templateName, templateData: {} };
  if (!templates) {
    return ret;
  }

  templates.every(item => {
    if (nj.isObject(item)) {
      if (item.alias) {
        if (item.alias == templateName) {
          ret.templateName = item.name;
          ret.templateData = item;
          return false;
        }
      } else if (item.name == templateName) {
        ret.templateName = item.name;
        ret.templateData = item;
        return false;
      }
    }
    return true;
  });

  return ret;
}

module.exports = {
  getTemplatePath,
  getRootPath,
  deleteFolder,
  renderFile,
  renderAppendFile,
  getDeps,
  CNPM_REGISTRY,
  createParamsByTemplates,
  getResourceTemplateData
};
