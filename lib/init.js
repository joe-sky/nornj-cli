const { exec, execSync } = require('child_process');
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { sep } = path;
const targz = require('targz');
const downloadGitRepo = require('download-git-repo');
const {
  getTemplatePath,
  getRootPath,
  getGlobalTemplatesConfig,
  deleteFolder,
  renderFile,
  cascadeRenderTemplateFile,
  getResourceTemplateData,
  mvUnzipFolder,
  CNPM_REGISTRY
} = require('./utils');
const { getLatestTarball, downloadTemplate } = require('./download');
const nj = require('nornj/dist/nornj.common').default;
require('./nj.config');
const inquirer = require('inquirer');
const argv = require('yargs').argv;
const rimraf = require('rimraf');

function initProjectTemplate(projectName, templateName, templateData) {
  co(function*() {
    let jest = false;
    let puppeteer = false;
    if ((yield prompt('Do you need jest? (Y/N)')).trim().toLowerCase() === 'y') {
      jest = true;

      if ((yield prompt('Do you need e2e test? (Y/N)')).trim().toLowerCase() === 'y') {
        puppeteer = true;
      }
    } else {
      deleteFolder(`.${sep}${projectName}${sep}test`);
    }

    cascadeRenderTemplateFile(
      `.${sep}${projectName}${sep}templates${sep}project`,
      `.${sep}${projectName}`,
      'project',
      templateName,
      {
        projectName,
        jest,
        puppeteer
      },
      templateData
    );

    //Render learning guide
    renderFile(
      `.${sep}${projectName}${sep}README.md`,
      null,
      {
        learningGuide: fs.readFileSync(`${getRootPath()}docs${sep}learningGuide.md`, 'utf-8')
      },
      templateData
    );

    const needInstall = (yield prompt('Do you want to npm install(Y/N)?')).trim().toLowerCase() === 'y';
    if (!needInstall) {
      console.log(chalk.green('\n √ Create completed!'));
      process.exit();
    }

    //Npm install
    execSync(`cd ${projectName} && npm install ` + (argv.cnpm ? CNPM_REGISTRY : ''), { stdio: [0, 1, 2] });

    console.log(chalk.green('\n √ Create completed!'));
    process.exit();
  });
}

module.exports = () => {
  let templatesConfig = require('../templates.config.json');
  const globalTemplatesConfig = getGlobalTemplatesConfig();
  if (globalTemplatesConfig) {
    try {
      templatesConfig = require(globalTemplatesConfig);
    } catch (ex) {}
  }

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
          //Download templates and unzip
          let spinner = ora('downloading... (just take a break, these whole things may take a long time.)');
          spinner.start();

          const cnpmMode = templateData.downloadMode == 'cnpm';
          (async function() {
            let downloadUrl = templateData.downloadUrl;
            if (cnpmMode) {
              downloadUrl = await getLatestTarball(templateData.downloadUrl);
            }

            await downloadTemplate(downloadUrl, projectName);
            spinner.stop();
            console.log(chalk.green('\n √ Download finished.'));

            spinner = ora('Unzipping files...');
            spinner.start();

            const tgzFileName = `${process.cwd()}${sep}${projectName}.tgz`;
            const projectPath = `${process.cwd()}${sep}${projectName}`;
            rimraf.sync(projectPath);
            targz.decompress(
              {
                src: tgzFileName,
                dest: projectPath + (cnpmMode ? '_tmp' : ''),
                tar: {
                  readable: true,
                  writable: true
                }
              },
              async function(err) {
                if (cnpmMode) {
                  await mvUnzipFolder(`${projectPath}_tmp${sep}package`, projectPath);
                  rimraf.sync(projectPath + '_tmp');
                }
                rimraf.sync(tgzFileName);
                spinner.stop();
                console.log(chalk.green('\n √ Unzip completed.'));

                initProjectTemplate(projectName, templateName, templateData);
              }
            );
          })();
        } else if (templateName.indexOf('/') > -1) {
          //Download templates from github
          let gitUrl = `https://github.com/${templateName.indexOf('#')[0]}.git`;
          let branch = templateName.indexOf('#')[1] || 'master';

          const spinner = ora('Downloading... (just take a break, these whole things may take a long time.)');
          spinner.start();

          downloadGitRepo(templateName, projectName, function(error) {
            spinner.stop();
            if (error) {
              console.log(error);
              process.exit();
            }
            console.log(chalk.green('\n √ Download finished.'));

            initProjectTemplate(projectName, templateName, templateData);
          });
        } else {
          //Use local templates
          const tmplPath = getTemplatePath() + templateName + '.tar.gz';
          if (!fs.existsSync(tmplPath)) {
            console.log(chalk.red('\n x Template does not exist!'));
            process.exit();
          }

          const spinner = ora('Unzipping files...');
          spinner.start();

          targz.decompress(
            {
              src: tmplPath,
              dest: `${process.cwd()}${sep}${projectName}`,
              tar: {
                readable: true,
                writable: true
              }
            },
            function(err) {
              console.log(chalk.green('\n √ Unzip completed.'));
              spinner.stop();

              initProjectTemplate(projectName, templateName, templateData);
            }
          );
        }
      });
    });
};
