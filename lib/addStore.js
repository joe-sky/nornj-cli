'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const { getTemplatePath, renderFile, renderAppendFile } = require('./utils');
const nj = require('nornj/dist/nornj.common').default;
const includeParser = require('nornj/tools/includeParser');
require('./nj.config');
const inquirer = require('inquirer');

module.exports = () => {
  let storeName;
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
          name: 'storeTemplate',
          message: 'Which store template do you want to use?',
          choices: pkg.njCliConfig.storeTemplates ? pkg.njCliConfig.storeTemplates : ['default']
        }
      ])
      .then(answers => {
        co(function*() {
          const storeTemplate = answers.storeTemplate === 'default' ? '' : nj.filters.capitalize(answers.storeTemplate);
          storeName = process.argv[3];
          if (storeName == null) {
            storeName = yield prompt('Store Name: ');
          }

          //store resource files
          renderFile(
            `./templates/src/stores/newStore${storeTemplate}.js`,
            `./src/stores/${storeName}Store.js`,
            { storeName }
          );

          console.log(chalk.green('\n √ Created store finished!'));
          process.exit();
        });
      });
  }
};
