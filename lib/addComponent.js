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
  const njCliConfig = pkg.njCliConfig;
  const templateDataGlobal = njCliConfig.templateData;

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'componentTemplate',
        message: 'Which component template do you want to use?',
        choices: njCliConfig.componentTemplates
          ? njCliConfig.componentTemplates.map(
              item => (nj.isObject(item) ? (item.alias ? item.alias : item.name) : item)
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
        const componentTemplate = templateName === 'default' ? '' : n`${templateName} | capitalize`;
        componentName = process.argv[3];
        if (componentName == null) {
          componentName = yield prompt('Component Name: ');
        }

        //Component files
        const componentFiles = fs.readdirSync(`./templates/src/components/newComponent${componentTemplate}`);
        componentFiles.forEach(fileName => {
          fileName = fileName.replace(/\.nornj/, '');
          if (fileName.includes('.spec.') && !njCliConfig.jest) {
            return;
          }

          const isNewComponentFile = fileName.toLowerCase().startsWith('newcomponent.'),
            newComponentExName = fileName.substr(fileName.indexOf('.'));

          renderFile(
            `./templates/src/components/newComponent${componentTemplate}/${fileName}.nornj`,
            `./src/components/${componentName}/${
              isNewComponentFile ? n`${componentName + newComponentExName} | capitalize` : fileName
            }`,
            { componentName },
            templateData,
            templateDataGlobal
          );
        });

        console.log(chalk.green('\n √ Created component finished!'));
        process.exit();
      });
    });
};
