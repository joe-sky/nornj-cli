const { execSync } = require('child_process');
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
const {
  sameNameExts,
  insertTmplDelimiters,
  NOTHING,
  GLOBAL_TEMPLATES_DIR,
  TEMPLATES_DIR,
  UNRENDERED_EXT
} = require('./constants');
const { ts2js } = require('./ts2js');
const { getData } = require('nornj/lib/transforms/transformData');

function getTemplatePath(notSourceFile) {
  return getRootPath() + 'templates/' + (notSourceFile ? '' : 'sourceFiles/');
}

function getRootPath() {
  return path.resolve(__dirname, '..').replace(/\\/g, '/') + '/';
}

function getNjCliConfig(cwd = process.cwd()) {
  let njCliConfig = {},
    pkg;

  if (fs.existsSync(`${cwd}${sep}package.json`) && (pkg = require(`${cwd}${sep}package.json`)) && pkg.njCliConfig) {
    njCliConfig = pkg.njCliConfig;
  } else if (fs.existsSync(`${cwd}${sep}.nornjrc`)) {
    const configs = JSON.parse(fs.readFileSync(`${cwd}${sep}.nornjrc`, 'utf-8'));
    if (configs) {
      njCliConfig = configs;
    }
  } else if (fs.existsSync(`${cwd}${sep}.nornjrc.json`)) {
    const configs = require(`${cwd}${sep}.nornjrc.json`);
    if (configs) {
      njCliConfig = configs;
    }
  } else if (fs.existsSync(`${cwd}${sep}.nornjrc.js`)) {
    const configs = require(`${cwd}${sep}.nornjrc.js`);
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
  const _pathTo = pathTo != null ? pathTo : path;
  const lastIndexPoint = _pathTo.lastIndexOf('.');
  const ext = _pathTo.substr(lastIndexPoint);
  if (UNRENDERED_EXT.includes(ext)) {
    return;
  }

  params && (params[0].fileName = path);
  let fileTxt = nj.render(fs.readFileSync(path, 'utf-8'), ...params);
  if (fileTxt.trim() === NOTHING) {
    return NOTHING;
  }

  if (pathTo != null) {
    const pathToDir = pathTo.substr(0, pathTo.lastIndexOf(sep));
    if (!fs.existsSync(pathToDir)) {
      mkdirp.sync(pathToDir);
    }
  }

  pathTo = _pathTo;
  if (
    ['.ts', '.tsx'].includes(pathTo.substr(lastIndexPoint)) &&
    pathTo.substr(lastIndexPoint - 2, 2) !== '.d' &&
    !getData('ts', params)
  ) {
    fs.existsSync(pathTo) && fs.unlinkSync(pathTo);
    pathTo = pathTo.substr(0, lastIndexPoint) + ext.replace(/t/, 'j');
    fileTxt = ts2js(fileTxt);
  }

  fs.writeFileSync(pathTo, fileTxt);
  return fileTxt;
}

function renderAppendFile(path, pathTo, newLines, ...params) {
  const fileTxt = nj.render(fs.readFileSync(path, 'utf-8'), ...params);
  fs.appendFileSync(pathTo != null ? pathTo : path, _.times(newLines, i => '\n').join('') + fileTxt.trim());
}

function renderProjectFiles(path, ...params) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      const curPath = `${path}${sep}${file}`;
      if (curPath.endsWith(`${sep}${GLOBAL_TEMPLATES_DIR}`)) {
        return;
      }

      if (fs.statSync(curPath).isDirectory()) {
        renderProjectFiles(curPath, ...params);
      } else {
        let newPath = nj.render(curPath, ...params);
        if (newPath.endsWith('.nornj')) {
          newPath = newPath.replace(/\.nornj$/, '');
        }

        renderFile(newPath, null, ...params);
      }
    });
  }
}

const REGEX_HAS_OPTS = /\[[^\]]+\]/;

function renderTemplateFiles(templatesPath, path, renderTo, type, templateName, ...params) {
  if (templatesPath == null) {
    templatesPath = GLOBAL_TEMPLATES_DIR;
  }

  let files = [];
  if (fs.existsSync(path)) {
    const directoryName = path.substr(path.lastIndexOf(sep) + 1);
    const hasOptions = REGEX_HAS_OPTS.test(directoryName);

    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      if (file.includes(TEMPLATES_DIR)) {
        return;
      }

      const curPath = `${path}${sep}${file}`;
      if (fs.statSync(curPath).isDirectory()) {
        if (hasOptions && !file.endsWith('-' + templateName)) {
          return;
        }

        renderTemplateFiles(templatesPath, curPath, renderTo, type, templateName, ...params);
      } else {
        if (hasOptions && !file.substr(0, file.indexOf('.')).endsWith('-' + templateName)) {
          return;
        }

        let newPath = nj
          .render(curPath.split(`${sep}${templatesPath}${sep}${type}${sep}`)[1], ...params)
          .replace(/[\[\]]/g, '')
          .replace(new RegExp('-' + templateName, 'g'), '');

        let isInsertTmpl = false;
        if (newPath.endsWith('.t.nornj')) {
          newPath = newPath.replace(/\.t\.nornj$/, '');
          isInsertTmpl = true;
        } else if (newPath.endsWith('.nornj')) {
          newPath = newPath.replace(/\.nornj$/, '');
        }

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
          const ret = renderFile(curPath, `${renderTo}${sep}${newPath}`, ...params);
          ret !== NOTHING && deleteSameNameFile(newPath, renderTo);
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
          const filePath = `${curPath}${sep}${file}`;
          fs.existsSync(filePath) && fs.unlinkSync(filePath);
        }
      });
    }
  });
}

function removeNewLineBothEnds(str) {
  return /^\r\n/.test(str) ? str.replace(/^\r\n/, '').replace(/\r\n$/, '') : str.replace(/^\n/, '').replace(/\n$/, '');
}

function createParamsByTemplates(templates, initParams = {}, ...templateParams) {
  const params = Object.assign({}, initParams);
  const { start, end, rawStart, rawEnd } = initParams.delimiters;

  Object.keys(templates).forEach(k => {
    const tmplStr = removeNewLineBothEnds(templates[k]);
    const delimiter = rawStart + start + k + end + rawEnd;
    params[k] = nj.render(tmplStr.indexOf(delimiter) < 0 ? tmplStr + delimiter : tmplStr, ...templateParams);
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

function getTemplatesPath(templatesName, cwd = process.cwd()) {
  const localTemplatesPath = `${cwd}${sep}templates`;
  if (fs.existsSync(localTemplatesPath)) {
    return localTemplatesPath;
  }

  if (templatesName) {
    return `${cwd}${sep}node_modules${sep}${templatesName}`;
  }

  return localTemplatesPath;
}

function hasYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  getTemplatePath,
  getRootPath,
  getNjCliConfig,
  getGlobalTemplatesConfig,
  deleteFolder,
  renderFile,
  renderAppendFile,
  renderProjectFiles,
  renderTemplateFiles,
  CNPM_REGISTRY,
  createParamsByTemplates,
  getResourceTemplateData,
  mvUnzipFolder,
  getTemplatesPath,
  hasYarn
};
