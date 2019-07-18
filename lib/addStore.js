const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { sep } = path;
const { renderFile, getResourceTemplateData, cascadeRenderTemplateFile } = require('./utils');
const { default: nj, expression: n } = require('nornj/dist/nornj.common');
const includeParser = require('nornj/tools/includeParser');
const inquirer = require('inquirer');

module.exports = () => {
  let storeName;
  const pkg = require(`${process.cwd()}/package.json`);
  const njCliConfig = pkg.njCliConfig;
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
        const storeTemplate = templateName === 'default' ? '' : templateName;
        storeName = process.argv[3];
        if (storeName == null) {
          storeName = yield prompt('Store Name: ');
        }

        cascadeRenderTemplateFile(
          `${process.cwd()}${sep}templates${sep}store`,
          process.cwd(),
          'store',
          {
            storeTemplate,
            storeName
          },
          templateData,
          templateDataGlobal
        );

        // //Service files
        // renderFile(
        //   `./templates/src/services/newService${storeTemplate}.js.nornj`,
        //   `./src/services/${storeName}.js`,
        //   {
        //     storeName
        //   },
        //   templateData,
        //   templateDataGlobal
        // );

        // //Store files
        // renderFile(
        //   `./templates/src/stores/newStore${storeTemplate}.js.nornj`,
        //   `./src/stores/${storeName}.${templateData.mobx ? 'store' : 'mst'}.js`,
        //   {
        //     storeName
        //   },
        //   templateData,
        //   templateDataGlobal
        // );

        console.log(chalk.green('\n √ Created store finished!'));
        process.exit();
      });
    });
};
