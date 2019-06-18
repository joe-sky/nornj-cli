'use strict';

const { exec, execSync } = require('child_process');
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const targz = require('targz');
const download = require('download-git-repo');
const {
  getTemplatePath,
  getRootPath,
  deleteFolder,
  renderFile,
  cascadeRenderTemplateFile,
  getResourceTemplateData,
  CNPM_REGISTRY
} = require('./utils');
const { getLatestTarball, downloadTemplate } = require('./download');
const nj = require('nornj/dist/nornj.common').default;
require('./nj.config');
const inquirer = require('inquirer');
const argv = require('yargs').argv;

function initProjectTemplate(projectName, templateData) {
  co(function*() {
    let jest = '';
    let puppeteer = '';
    if ((yield prompt('Do you need jest? (Y/N)')).trim().toLowerCase() === 'y') {
      jest = `"jest": "^23.5.0",
    "jest-css-modules-transform": "^2.0.0",
    "jest-environment-enzyme": "^6.0.3",
    "jest-enzyme": "^6.0.3",
    `;

      if ((yield prompt('Do you need e2e test? (Y/N)')).trim().toLowerCase() === 'y') {
        puppeteer = `"puppeteer": "^1.7.0",
    `;
      }
    } else {
      deleteFolder(`./${projectName}/test`);
    }

    cascadeRenderTemplateFile(
      `./${projectName}`,
      {
        projectName,
        jest,
        puppeteer
      },
      templateData
    );

    //Render learning guide
    renderFile(
      `./${projectName}/README.md`,
      null,
      {
        learningGuide: fs.readFileSync(`${getRootPath()}docs/learningGuide.md`, 'utf-8')
      },
      templateData
    );

    const needInstall = (yield prompt('Do you want to npm install(Y/N)?')).trim().toLowerCase() === 'y';
    if (!needInstall) {
      console.log(chalk.green('\n √ Create completed !'));
      process.exit();
    }

    //Npm install
    execSync(`cd ${projectName} && npm install ` + (argv.cnpm ? CNPM_REGISTRY : ''), { stdio: [0, 1, 2] });

    console.log(chalk.green('\n √ Create completed!'));
    process.exit();
  });
}

module.exports = () => {
  const templatesConfig = require('../templates.config.json');

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'templateName',
        message: 'Please select a project template:',
        choices: templatesConfig
          ? templatesConfig.map(item => (nj.isObject(item) ? (item.alias ? item.alias : item.name) : item))
          : ['react-mst', 'react-mst-app', 'other']
      }
    ])
    .then(answers => {
      co(function*() {
        let { templateName, templateData } = getResourceTemplateData(answers.templateName, templatesConfig);
        if (templateName === 'other') {
          templateName = yield prompt('Template Name: ');
        }
        const projectName = yield prompt('Project Name: ');

        if (templateData.downloadUrl) {
          getLatestTarball(templateData.downloadUrl).then(tarballUrl => {
            downloadTemplate(tarballUrl, projectName).then(() => initProjectTemplate(projectName, templateData));
          });
        } else if (templateName.indexOf('/') > -1) {
          //Download templates
          let gitUrl = `https://github.com/${templateName.indexOf('#')[0]}.git`;
          let branch = templateName.indexOf('#')[1] || 'master';

          let spinner = ora('downloading... (just take a break, these whole things may take a long time.)');
          spinner.start();

          download(templateName, projectName, function(error) {
            spinner.stop();
            if (error) {
              console.log(error);
              process.exit();
            }
            console.log(chalk.green('\n √ download finished!'));

            initProjectTemplate(projectName, templateData);
          });
        } else {
          //Use local templates
          const tmplPath = getTemplatePath() + templateName + '.tar.gz';
          if (!fs.existsSync(tmplPath)) {
            console.log(chalk.red('\n x Template does not exist!'));
            process.exit();
          }

          let spinner = ora('Unzipping files...');
          spinner.start();

          targz.decompress(
            {
              src: tmplPath,
              dest: `${process.cwd()}/${projectName}`,
              tar: {
                readable: true,
                writable: true
              }
            },
            function(err) {
              console.log(chalk.green('\n √ Unzip completed.'));
              spinner.stop();

              initProjectTemplate(projectName, templateData);
            }
          );
        }
      });
    });
};
