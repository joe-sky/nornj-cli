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
const { default: nj, expression: n } = require('nornj');
const includeParser = require('nornj/tools/includeParser');
const inquirer = require('inquirer');
const { EXT } = require('./constants');
const argv = require('yargs').argv;

module.exports = async type => {
  if (type == null) {
    type = process.argv[3];
  }

  const njCliConfig = getNjCliConfig();
  const templatesPath = getTemplatesPath(njCliConfig.templates);
  const templateDataGlobal = njCliConfig.templateData;
  const promptName = n`'delete' + ${type} | upperFirst`;
  const files = n`${njCliConfig}.files[${type}]`;

  if (!files || files.length < 1) {
    console.log(chalk.red(`\n × There are no ${type} that can be deleted!`));
    process.exit();
  }

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: promptName,
      message: `Which ${type} file do you want to delete?`,
      choices: files.map(({ fileName }) => fileName)
    }
  ]);

  const fileName = answers[promptName];
  const answersConfirmDelete = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'result',
      message: `Confirm to delete the ${type} named ${fileName}? (This is an irreversible operation, please be careful)`,
      default: false
    }
  ]);

  if (!answersConfirmDelete.result) {
    console.log(chalk.red(`\n × User canceled operation.`));
    process.exit();
  }

  const { templateName, templateData } = getFileTemplateData(
    files.find(item => item.fileName === fileName).templateName,
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
      get store() {
        return templateData.mobx ? EXT.MOBX : EXT.MST;
      },
      get rootStore() {
        return templateDataGlobal.mobxRoot ? EXT.MOBX : EXT.MST;
      },
      get ext() {
        return argv.ts || templateDataGlobal.ts ? EXT.TS : EXT.JS;
      },
      get extx() {
        return argv.ts || templateDataGlobal.ts ? EXT.TSX : EXT.JSX;
      }
    },
    templateData,
    { ...templateDataGlobal, ts: argv.ts || templateDataGlobal.ts }
  );

  console.log(chalk.green(`\n √ Delete ${type} completed!`));
  process.exit();
};
