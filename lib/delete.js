const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { sep } = path;
const { getNjCliConfig, getResourceTemplateData, renderTemplateFiles, getTemplatesPath } = require('./utils');
const { default: nj, expression: n } = require('nornj/dist/nornj.common');
const includeParser = require('nornj/tools/includeParser');
const inquirer = require('inquirer');
const { EXT } = require('./constants');

module.exports = type => {
  let componentName;
  const njCliConfig = getNjCliConfig();
  const templatesPath = getTemplatesPath(njCliConfig.templates);
  const templateDataGlobal = njCliConfig.templateData;

  renderTemplateFiles(
    templatesPath.includes('node_modules') ? njCliConfig.templates : null,
    `${templatesPath}${sep}component`,
    process.cwd(),
    'component',
    templateName,
    {
      templateName,
      componentName,
      ComponentName: n`${componentName} | capitalize`,
      get ext() {
        return templateDataGlobal.ts ? EXT.TS : EXT.JS;
      },
      get extx() {
        return templateDataGlobal.ts ? EXT.TSX : EXT.JSX;
      }
    },
    templateData,
    templateDataGlobal
  );

  console.log(chalk.green('\n √ Delete completed!'));
  process.exit();
};
