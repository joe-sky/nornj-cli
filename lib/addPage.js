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

module.exports = () => {
  let pageName;
  const njCliConfig = getNjCliConfig();
  const templatesPath = getTemplatesPath(njCliConfig.templates);
  const templateDataGlobal = njCliConfig.templateData;

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'pageTemplate',
        message: 'Which page template do you want to use?',
        choices: njCliConfig.pageTemplates
          ? njCliConfig.pageTemplates.map(item => (nj.isObject(item) ? (item.alias ? item.alias : item.name) : item))
          : ['default', 'chart', 'form', 'empty']
      }
    ])
    .then(answers => {
      co(function*() {
        const { templateName, templateData } = getResourceTemplateData(answers.pageTemplate, njCliConfig.pageTemplates);
        pageName = process.argv[3];
        if (pageName == null) {
          pageName = yield prompt('Page Name: ');
        }

        renderTemplateFiles(
          templatesPath.includes('node_modules') ? njCliConfig.templates : null,
          `${templatesPath}${sep}page`,
          process.cwd(),
          'page',
          templateName,
          {
            templateName,
            pageName,
            PageName: n`${pageName} | upperFirst`,
            get store() {
              return templateData.mobx ? EXT.MOBX : EXT.MST;
            },
            get rootStore() {
              return templateDataGlobal.mobxRoot ? EXT.MOBX : EXT.MST;
            },
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

        console.log(chalk.green('\n √ Created page completed!'));
        process.exit();
      });
    });
};
