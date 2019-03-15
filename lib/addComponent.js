'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const { getTemplatePath, renderFile, renderAppendFile } = require('./utils');
const nj = require('nornj').default;
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
            ? pkg.njCliConfig.componentTemplates
            : ['default']
        }
      ])
      .then(answers => {
        co(function*() {
          const componentTemplate =
            answers.componentTemplate === 'default' ? '' : nj.filters.capitalize(answers.componentTemplate);
          componentName = process.argv[3];
          if (componentName == null) {
            componentName = yield prompt('Component Name: ');
          }

          //component resource files
          const componentFiles = fs.readdirSync(`./templates/src/${isApp ? 'app' : 'web'}/components/newComponent${componentTemplate}`);
          componentFiles.forEach(fileName => {
            const isNewComponentFile = fileName.toLowerCase().startsWith('newcomponent.'),
              newComponentExName = fileName.substr(fileName.indexOf('.'));

            renderFile(
              `./templates/src/${isApp ? 'app' : 'web'}/components/newComponent${componentTemplate}/${fileName}`,
              `./src/${isApp ? 'app' : 'web'}/components/${componentName}/${
                isNewComponentFile ? nj.filters.capitalize(componentName + newComponentExName) : fileName
              }`,
              { componentName }
            );
          });

          console.log(chalk.green('\n √ Created component finished!'));
          process.exit();
        });
      });
  }
};
