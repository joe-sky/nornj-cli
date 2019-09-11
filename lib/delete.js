const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { sep } = path;
const { getNjCliConfig, getFileTemplateData, deleteFilesByTemplate, getTemplatesPath } = require('./utils');
const { default: nj, expression: n } = require('nornj/dist/nornj.common');
const includeParser = require('nornj/tools/includeParser');
const inquirer = require('inquirer');
const { EXT } = require('./constants');

module.exports = type => {
  const njCliConfig = getNjCliConfig();
  const templatesPath = getTemplatesPath(njCliConfig.templates);
  const templateDataGlobal = njCliConfig.templateData;
  const promptName = n`'delete' + ${type} | upperFirst`;

  if (type == null) {
    type = process.argv[3];
  }

  inquirer
    .prompt([
      {
        type: 'list',
        name: promptName,
        message: `Which ${type} file do you want to delete?`,
        choices: njCliConfig.files[type].map(({ fileName }) => fileName)
      }
    ])
    .then(answers => {
      const fileName = answers[promptName];
      const { templateName, templateData } = getFileTemplateData(
        njCliConfig.files[type].find(item => item.fileName === fileName).templateName,
        njCliConfig[`${type}Templates`]
      );

      deleteFilesByTemplate(
        templatesPath.includes('node_modules') ? njCliConfig.templates : null,
        `${templatesPath}${sep}${type}`,
        process.cwd(),
        type,
        templateName,
        {
          templateName,
          [`${type}Name`]: fileName,
          [n`(${type} + 'Name') | upperFirst`]: n`${fileName} | upperFirst`,
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

      console.log(chalk.green(`\n √ Delete ${type} completed!`));
      process.exit();
    });
};
