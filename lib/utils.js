const fs = require('fs');
const { default: nj, expression: n } = require('nornj/dist/nornj.common');
const includeParser = require('nornj/tools/includeParser');
require('./nj.config');
const mkdirp = require('mkdirp');
const _ = require('lodash');
const path = require('path');
const { sep } = path;
const mv = require('mv');
const CNPM_REGISTRY = ' --registry https://registry.npm.taobao.org';
const { sameNameExts, insertTmplDelimiters } = require('./constants');

function getTemplatePath(notSourceFile) {
  return getRootPath() + 'templates/' + (notSourceFile ? '' : 'sourceFiles/');
}

function getRootPath() {
  return path.resolve(__dirname, '..').replace(/\\/g, '/') + '/';
}

function getNjCliConfig() {
  let njCliConfig = {},
    cwd = process.cwd(),
    pkg;

  if (fs.existsSync(`${cwd}/package.json`) && (pkg = require(`${cwd}/package.json`)) && pkg.njCliConfig) {
    njCliConfig = pkg.njCliConfig;
  } else if (fs.existsSync(`${cwd}/.nornjrc`)) {
    const configs = JSON.parse(fs.readFileSync(`${cwd}/.nornjrc`, 'utf-8'));
    if (configs) {
      njCliConfig = configs;
    }
  } else if (fs.existsSync(`${cwd}/.nornjrc.json`)) {
    const configs = require(`${cwd}/.nornjrc.json`);
    if (configs) {
      njCliConfig = configs;
    }
  } else if (fs.existsSync(`${cwd}/.nornjrc.js`)) {
    const configs = require(`${cwd}/.nornjrc.js`);
    if (configs) {
      njCliConfig = configs;
    }
  }

  return njCliConfig;
}

const TEMPLATES_CONFIG_MODULE = 'nornj-cli-config';
function getGlobalTemplatesConfig() {
  const globalModulesPath = path.resolve(__dirname, '../..');
  const modules = fs.readdirSync(globalModulesPath);
  let ret;

  for (let i = 0; i < modules.length; i++) {
    if (modules[i].startsWith('@')) {
      const scopeModuleName = modules[i];
      const scopeModules = fs.readdirSync(`${globalModulesPath}${sep}${scopeModuleName}`);
      let isBreak = false;

      for (let j = 0; j < scopeModules.length; j++) {
        if (scopeModules[j].includes(TEMPLATES_CONFIG_MODULE)) {
          ret = `${globalModulesPath}${sep}${scopeModuleName}${sep}${scopeModules[j]}`;
          isBreak = true;
          break;
        }
      }
      if (isBreak) {
        break;
      }
    } else if (modules[i].includes(TEMPLATES_CONFIG_MODULE)) {
      ret = `${globalModulesPath}${sep}${modules[i]}`;
      break;
    }
  }

  return ret;
}

function deleteFolder(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function(file, index) {
      const curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function renderFile(path, pathTo, ...params) {
  params && (params[0].fileName = path);
  let fileTxt = nj.render(fs.readFileSync(path, 'utf-8'), ...params);
  if (fileTxt.trim() === 'nj-nothing') {
    return;
  }

  if (pathTo != null) {
    const pathToDir = pathTo.substr(0, pathTo.lastIndexOf(sep));
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

const REGEX_HAS_OPTS = /\[[^\]]+\]/;

function cascadeRenderTemplateFile(path, renderTo, type, templateName, ...params) {
  let files = [];
  if (fs.existsSync(path)) {
    const directoryName = path.substr(path.lastIndexOf(sep) + 1);
    const hasOptions = REGEX_HAS_OPTS.test(directoryName);

    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      const curPath = `${path}${sep}${file}`;

      if (fs.statSync(curPath).isDirectory()) {
        if (hasOptions && !file.endsWith('-' + templateName)) {
          return;
        }

        cascadeRenderTemplateFile(curPath, renderTo, type, templateName, ...params);
      } else {
        if (hasOptions && !file.substr(0, file.indexOf('.')).endsWith('-' + templateName)) {
          return;
        }

        let newPath = nj
          .render(curPath.split(`${sep}templates${sep}${type}${sep}`)[1], ...params)
          .replace(/[\[\]]/g, '')
          .replace(new RegExp('-' + templateName, 'g'), '');

        let isInsertTmpl = false;
        if (newPath.endsWith('.t.nornj')) {
          newPath = newPath.replace(/\.t\.nornj$/, '');
          isInsertTmpl = true;
        } else if (newPath.endsWith('.nornj')) {
          newPath = newPath.replace(/\.nornj$/, '');
        }

        deleteSameNameFile(newPath, renderTo);

        if (isInsertTmpl) {
          const tmpls = includeParser(fs.readFileSync(curPath, 'utf-8'), null, nj.tmplRule, true);

          insertTmplDelimiters.forEach(delimiters => {
            renderFile(
              `${renderTo}${sep}${newPath}`,
              null,
              createParamsByTemplates(
                tmpls,
                {
                  delimiters
                },
                ...params
              ),
              ...params
            );
          });
        } else {
          renderFile(curPath, `${renderTo}${sep}${newPath}`, ...params);
        }
      }
    });
  }
}

function endsWithExts(extGroup, file) {
  let ret;
  extGroup.forEach(ext => {
    if (file.endsWith(ext)) {
      ret = ext;
    }
  });

  return ret;
}

function deleteSameNameFile(newPath, renderTo) {
  const curPath = `${renderTo}${sep}${newPath.substr(0, newPath.lastIndexOf(sep))}`;
  const newFile = newPath.substr(newPath.lastIndexOf(sep) + 1);

  sameNameExts.forEach(extGroup => {
    let hasExt = false;
    extGroup.forEach(ext => {
      if (newFile.endsWith(ext)) {
        hasExt = true;
      }
    });

    if (hasExt && fs.existsSync(curPath)) {
      files = fs.readdirSync(curPath);
      files.forEach((file, index) => {
        let _newFile, _file;

        const extNew = endsWithExts(extGroup, newFile);
        if (extNew) {
          _newFile = newFile.split(extNew)[0];
        }
        const extCur = endsWithExts(extGroup, file);
        if (file.endsWith(extCur)) {
          _file = file.split(extCur)[0];
        }

        if (_file === _newFile && extNew !== extCur) {
          fs.unlinkSync(`${curPath}${sep}${file}`);
        }
      });
    }
  });
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

function mvUnzipFolder(currentPath, targetPath) {
  return new Promise((resolve, reject) => {
    mv(currentPath, targetPath, { mkdirp: true }, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  getTemplatePath,
  getRootPath,
  getNjCliConfig,
  getGlobalTemplatesConfig,
  deleteFolder,
  renderFile,
  renderAppendFile,
  cascadeRenderTemplateFile,
  CNPM_REGISTRY,
  createParamsByTemplates,
  getResourceTemplateData,
  mvUnzipFolder
};
