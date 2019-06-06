'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const { getTemplatePath, renderFile, renderAppendFile, getResourceTemplateData } = require('./utils');
const { default: nj, expression: n } = require('nornj/dist/nornj.common');
const includeParser = require('nornj/tools/includeParser');
require('./nj.config');
const inquirer = require('inquirer');

module.exports = () => {
  let componentName;
  const pkg = require(`${process.cwd()}/package.json`);
  const templateType = pkg.templateType ? pkg.templateType : pkg.njCliConfig.templateType;
  const isApp = templateType === 'single-page-app';
  const templateMultiPage = templateType == 'multi-page';

  if (templateMultiPage) {
    // todo
  } else {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'componentTemplate',
          message: 'Which component template do you want to use?',
          choices: pkg.njCliConfig.componentTemplates
            ? pkg.njCliConfig.componentTemplates.map(
                item => (nj.isObject(item) ? (item.alias ? item.alias : item.name) : item)
              )
            : ['default', 'function']
        }
      ])
      .then(answers => {
        co(function*() {
          const { templateName, templateData } = getResourceTemplateData(
            answers.componentTemplate,
            pkg.njCliConfig.componentTemplates
          );
          const componentTemplate = templateName === 'default' ? '' : n`${templateName} | capitalize`;
          componentName = process.argv[3];
          if (componentName == null) {
            componentName = yield prompt('Component Name: ');
          }

          //component resource files
          const componentFiles = fs.readdirSync(
            `./templates/src/${isApp ? 'app' : 'web'}/components/newComponent${componentTemplate}`
          );
          componentFiles.forEach(fileName => {
            fileName = fileName.replace(/\.nornj/, '');
            if (fileName.includes('.spec.') && !pkg.njCliConfig.jest) {
              return;
            }

            const isNewComponentFile = fileName.toLowerCase().startsWith('newcomponent.'),
              newComponentExName = fileName.substr(fileName.indexOf('.'));

            renderFile(
              `./templates/src/${isApp ? 'app' : 'web'}/components/newComponent${componentTemplate}/${fileName}.nornj`,
              `./src/${isApp ? 'app' : 'web'}/components/${componentName}/${
                isNewComponentFile ? n`${componentName + newComponentExName} | capitalize` : fileName
              }`,
              { componentName },
              templateData
            );
          });

          console.log(chalk.green('\n √ Created component finished!'));
          process.exit();
        });
      });
  }
};
