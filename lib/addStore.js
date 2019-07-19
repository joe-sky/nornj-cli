const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { sep } = path;
const { getNjCliConfig, getResourceTemplateData, cascadeRenderTemplateFile } = require('./utils');
const { default: nj, expression: n } = require('nornj/dist/nornj.common');
const includeParser = require('nornj/tools/includeParser');
const inquirer = require('inquirer');
const { EXT } = require('./constants');

module.exports = () => {
  let storeName;
  const njCliConfig = getNjCliConfig();
  const templateDataGlobal = njCliConfig.templateData;

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'storeTemplate',
        message: 'Which store template do you want to use?',
        choices: njCliConfig.storeTemplates
          ? njCliConfig.storeTemplates.map(item => (nj.isObject(item) ? (item.alias ? item.alias : item.name) : item))
          : ['default', 'mobx']
      }
    ])
    .then(answers => {
      co(function*() {
        const { templateName, templateData } = getResourceTemplateData(
          answers.storeTemplate,
          njCliConfig.storeTemplates
        );

        storeName = process.argv[3];
        if (storeName == null) {
          storeName = yield prompt('Store Name: ');
        }

        cascadeRenderTemplateFile(
          `${process.cwd()}${sep}templates${sep}store`,
          process.cwd(),
          'store',
          templateName,
          {
            templateName,
            storeName,
            get store() {
              return templateData.mobx ? EXT.MOBX : EXT.MST;
            },
            get ext() {
              return templateData.ts ? EXT.TS : EXT.JS;
            },
            get extx() {
              return templateData.ts ? EXT.TSX : EXT.JSX;
            }
          },
          templateData,
          templateDataGlobal
        );

        console.log(chalk.green('\n √ Created store finished!'));
        process.exit();
      });
    });
};
