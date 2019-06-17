'use strict';

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
}

function deleteFolder(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      const curPath = path + '/' + file;
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
  let fileTxt = nj.render(fs.readFileSync(path, 'utf-8'), ...params);

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

function cascadeRenderTemplateFile(path, ...params) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      const curPath = path + '/' + file;
      const isTemplatesFolder = curPath.includes('templates');
      if (fs.statSync(curPath).isDirectory() && !isTemplatesFolder) {
        // recurse
        cascadeRenderTemplateFile(curPath, ...params);
      } else if (curPath.endsWith('.nornj') && !isTemplatesFolder) {
        renderFile(curPath, curPath.replace(/\.nornj/, ''), ...params);
        fs.unlinkSync(curPath);
      }
    });
  }
}

function createParamsByTemplates(templates, initParams = {}, ...templateParams) {
  const params = Object.assign({}, initParams);

  Object.keys(templates).forEach(k => {
    params[k] = nj.render(templates[k].trim(), ...templateParams);
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
  cascadeRenderTemplateFile,
  CNPM_REGISTRY,
  createParamsByTemplates,
  getResourceTemplateData
};
