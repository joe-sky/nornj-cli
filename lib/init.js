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
  renderProjectFiles,
  renderTemplateFiles,
  getResourceTemplateData,
  mvUnzipFolder,
  getNjCliConfig,
  getTemplatesPath,
  CNPM_REGISTRY,
  hasYarn
} = require('./utils');
const { getLatestTarball, downloadTemplate } = require('./download');
const nj = require('nornj').default;
require('./nj.config');
const inquirer = require('inquirer');
const argv = require('yargs').argv;
const rimraf = require('rimraf');
const { EXT } = require('./constants');

function initProjectTemplate(projectName, templateName, templateData) {
  const cwd = `.${sep}${projectName}`;
  const templatesPath = getTemplatesPath(null, cwd);

  co(function*() {
    let jest = false;
    let e2e = false;
    if ((yield prompt('Do you need jest? (Y/N)')).trim().toLowerCase() === 'y') {
      jest = true;

      if ((yield prompt('Do you need e2e test? (Y/N)')).trim().toLowerCase() === 'y') {
        e2e = true;
      }
    } else {
      deleteFolder(`${cwd}${sep}test`);
    }

    let ts = false;
    if ((yield prompt('Do you want to use typescript? (Y/N)')).trim().toLowerCase() === 'y') {
      ts = true;
    }

    const promptData = {};
    if (templateData.prompt) {
      const prompts = templateData.prompt;
      for (let i = 0; i < prompts.length; i++) {
        const answer = prompts[i].answers[(yield prompt(prompts[i].message)).trim().toLowerCase()];
        if (answer) {
          Object.assign(promptData, answer);
        }
      }
    }

    let spinner = ora('Rendering files...');
    spinner.start();

    const tmplParams = [
      {
        projectName,
        jest,
        e2e,
        ts,
        get store() {
          return templateData.mobxRoot ? EXT.MOBX : EXT.MST;
        },
        get ext() {
          return ts ? EXT.TS : EXT.JS;
        },
        get extx() {
          return ts ? EXT.TSX : EXT.JSX;
        }
      },
      templateData,
      promptData
    ];

    //Render files in project folder
    renderProjectFiles(cwd, ...tmplParams);

    //Render templates
    renderTemplateFiles(null, `${templatesPath}${sep}init`, `${cwd}`, 'init', templateName, ...tmplParams);

    //Render learning guide
    renderFile(
      `${cwd}${sep}README.md`,
      null,
      {
        learningGuide: fs.readFileSync(`${getRootPath()}docs${sep}learningGuide.md`, 'utf-8')
      },
      templateData
    );

    //Delete templates folder
    deleteFolder(`${cwd}${sep}templates`);
    spinner.stop();

    const needInstall = (yield prompt('Do you want to install packages? (Y/N)')).trim().toLowerCase() === 'y';
    if (!needInstall) {
      console.log(chalk.green('\n √ Init project completed!'));
      process.exit();
    }

    //Install packages
    execSync(`cd ${projectName} && ${hasYarn ? 'yarn' : 'npm install'} ` + (argv.cnpm ? CNPM_REGISTRY : ''), {
      stdio: [0, 1, 2]
    });

    console.log(chalk.green('\n √ Init project completed!'));
    process.exit();
  });
}

module.exports = () => {
  let templatesConfig = require('../templates.config');
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
          let spinner = ora('Downloading... (just take a break, these whole things may take a long time.)');
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
