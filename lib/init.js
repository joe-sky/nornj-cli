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
  getDeps
} = require('./utils');
const nj = require('nornj').default;
require('./nj.config');
const inquirer = require('inquirer');

module.exports = () => {
  inquirer.prompt([{
    type: 'list',
    name: 'tmplName',
    message: 'Please select a project template:',
    choices: [
      'react-mst[single-page]',
      'react-mobx[multi-page]',
      'Y-Dept/template-saas',
      'Y-Dept/react-mobx',
      'Y-Dept/react-mobx-ls',
      'other'
    ],
  }]).then(answers => {
    co(function*() {
      let tmplName = answers.tmplName.replace(/\[[^[\]]+\]/g, '');
      if (tmplName === 'other') {
        tmplName = yield prompt('Template Name: ');
      }
      const projectName = yield prompt('Project Name: ');

      /**
       * 判断是否使用gitHub模版
       */
      if (tmplName.indexOf('/') > -1) {
        let gitUrl = `https://github.com/${tmplName.indexOf('#')[0]}.git`;
        let branch = tmplName.indexOf('#')[1] || 'master';

        let spinner = ora('downloading... (just take a break, these whole things may take a long time.)')
        spinner.start();

        download(tmplName, projectName, function(error) {
          spinner.stop();
          if (error) {
            console.log(error)
            process.exit()
          }
          console.log(chalk.green('\n √ download finished!'));

          const pkg = require(`${process.cwd()}/${projectName}/package.json`);
          const templateType = pkg.njCliConfig ? pkg.njCliConfig.templateType : null;
          const templateMultiPage = templateType == 'multi-page';
          const hasPrivateLib = pkg.njCliConfig && pkg.njCliConfig.privateLib != null;
          let useLayout;

          co(function*() {
            if (templateMultiPage) {
              useLayout = (yield prompt('Do you need to use layout on server side ? (Y/N)')).trim().toLowerCase() === 'y';

              renderFile(`./${projectName}/resources/htmls/common/bottomElements.html`, null, { useLayout });
              renderFile(`./${projectName}/resources/htmls/index.html`, null, { useLayout });
              renderFile(`./${projectName}/resources/htmls/page1.html`, null, { useLayout });
              renderFile(`./${projectName}/resources/htmls/page2.html`, null, { useLayout });
              renderFile(`./${projectName}/server/devApp.js`, null, { useLayout });
              if (!useLayout) {
                deleteFolder(`./${projectName}/resources/htmls/layout`);
              }
            }

            //render learning guide
            renderFile(`./${projectName}/README.md`, null, {
              learningGuide: fs.readFileSync(`${getRootPath()}docs/learningGuide.md`, 'utf-8')
            });

            const needInstall = (yield prompt('Do you want to npm install ? (Y/N)')).trim().toLowerCase() === 'y';
            if (!needInstall) {
              console.log(chalk.green('\n √ Create completed!'));
              process.exit();
            }

            //npm install
            execSync(`cd ${projectName} && npm install${hasPrivateLib ? (' ' + getDeps(pkg).join(' ')) : ''}`, { stdio: [0, 1, 2] });

            //install private libs
            hasPrivateLib && execSync(`cd ${projectName} && npm install ${pkg.njCliConfig.privateLib} --registry ${pkg.njCliConfig.privateNpmUrl} --save-dev`, { stdio: [0, 1, 2] });

            console.log(chalk.green('\n √ Create completed !'));
            process.exit();
          });
        });
      } else {
        /**
         * 使用本地template
         */
        const tmplPath = getTemplatePath() + tmplName + '.tar.gz';
        if (!fs.existsSync(tmplPath)) {
          console.log(chalk.red('\n x Template does not exist !'));
          process.exit();
        }

        let spinner = ora('Unzipping files...');
        spinner.start();

        targz.decompress({
          src: tmplPath,
          dest: `${process.cwd()}/${projectName}`,
          tar: {
            readable: true,
            writable: true
          }
        }, function(err) {
          console.log(chalk.green('\n √ Unzip completed.'));
          spinner.stop();

          const pkg = require(`${process.cwd()}/${projectName}/package.json`);
          const templateType = pkg.njCliConfig ? pkg.njCliConfig.templateType : null;
          const templateMultiPage = templateType == 'multi-page';
          const hasPrivateLib = pkg.njCliConfig && pkg.njCliConfig.privateLib != null;
          let useLayout;

          //set layout
          co(function*() {
            if (templateMultiPage) {
              useLayout = (yield prompt('Do you need to use layout on server side ? (Y/N)')).trim().toLowerCase() === 'y';

              renderFile(`./${projectName}/resources/htmls/common/bottomElements.html`, null, { useLayout });
              renderFile(`./${projectName}/resources/htmls/index.html`, null, { useLayout });
              renderFile(`./${projectName}/resources/htmls/page1.html`, null, { useLayout });
              renderFile(`./${projectName}/resources/htmls/page2.html`, null, { useLayout });
              renderFile(`./${projectName}/server/devApp.js`, null, { useLayout });
              if (!useLayout) {
                deleteFolder(`./${projectName}/resources/htmls/layout`);
              }
            }

            //render learning guide
            renderFile(`./${projectName}/README.md`, null, {
              learningGuide: fs.readFileSync(`${getRootPath()}docs/learningGuide.md`, 'utf-8')
            });

            const needInstall = (yield prompt('Do you want to npm install(Y/N)?')).trim().toLowerCase() === 'y';
            if (!needInstall) {
              console.log(chalk.green('\n √ Create completed !'));
              process.exit();
            }

            //npm install
            execSync(`cd ${projectName} && npm install${hasPrivateLib ? (' ' + getDeps(pkg).join(' ')) : ''}`, { stdio: [0, 1, 2] });

            //install private libs
            hasPrivateLib && execSync(`cd ${projectName} && npm install ${pkg.njCliConfig.privateLib} --registry ${pkg.njCliConfig.privateNpmUrl} --save-dev`, { stdio: [0, 1, 2] });

            console.log(chalk.green('\n √ Create completed !'));
            process.exit();
          });
        });
      }
    });
  });
};