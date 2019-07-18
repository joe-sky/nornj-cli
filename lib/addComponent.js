const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { sep } = path;
const { getResourceTemplateData, cascadeRenderTemplateFile } = require('./utils');
const { default: nj, expression: n } = require('nornj/dist/nornj.common');
const includeParser = require('nornj/tools/includeParser');
const inquirer = require('inquirer');
const { EXT } = require('./constants');

module.exports = () => {
  let componentName;
  const pkg = require(`${process.cwd()}/package.json`);
  const njCliConfig = pkg.njCliConfig;
  const templateDataGlobal = njCliConfig.templateData;

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'componentTemplate',
        message: 'Which component template do you want to use?',
        choices: njCliConfig.componentTemplates
          ? njCliConfig.componentTemplates.map(item =>
              nj.isObject(item) ? (item.alias ? item.alias : item.name) : item
            )
          : ['default', 'function']
      }
    ])
    .then(answers => {
      co(function*() {
        const { templateName, templateData } = getResourceTemplateData(
          answers.componentTemplate,
          njCliConfig.componentTemplates
        );

        componentName = process.argv[3];
        if (componentName == null) {
          componentName = yield prompt('Component Name: ');
        }

        cascadeRenderTemplateFile(
          `${process.cwd()}${sep}templates${sep}component`,
          process.cwd(),
          'component',
          templateName,
          {
            templateName,
            componentName,
            ComponentName: n`${componentName} | capitalize`,
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

        console.log(chalk.green('\n √ Created component finished!'));
        process.exit();
      });
    });
};
