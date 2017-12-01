'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config.json');
const chalk = require('chalk');
const fs = require('fs');
const unzip = require('unzip');
const download = require('download-git-repo');
const {
  getTemplatePath,
  getRootPath,
  deleteFolder,
  renderFile
} = require('./utils');
const nj = require('nornj').default;
require('./nj.config');

module.exports = () => {
  co(function*() {
    const tmplName = yield prompt('Template Name: ');
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

        //npm install
        let spinner2 = ora('installing...')
        spinner2.start();
        exec(`cd ${projectName} && npm install`, (error, stdout, stderr) => {
          if (error) {
            console.log(error)
            process.exit()
          }

          // install vic-common
          exec(`npm config set registry ${config.privateNpmUrl}`, (error, stdout, stderr) => {
            if (error) {
              console.log(error)
              process.exit()
            }

            exec(`cd ${projectName} && npm install ${config.privateLib} --save`, (error, stdout, stderr) => {
              if (error) {
                console.log(error)
                process.exit()
              }

              //reset npm
              exec(`npm config set registry https://registry.npmjs.org`, (error, stdout, stderr) => {
                spinner2.stop();
                if (error) {
                  console.log(error)
                  process.exit()
                }
                console.log(chalk.green('\n √ competed!'));
                process.exit()
              })
            })
          })
        })
      });
    } else {
      /**
       * 使用本地template
       */
      const tmplPath = getTemplatePath() + tmplName + '.zip';
      if (!fs.existsSync(tmplPath)) {
        console.log(chalk.red('\n x Template does not exist!'));
        process.exit();
      }

      let spinner = ora('Unzipping files...');
      spinner.start();

      fs.createReadStream(tmplPath)
        .pipe(unzip.Extract({ path: projectName }))
        .on('close', () => {
          console.log(chalk.green('\n √ Unzip completed.'));
          spinner.stop();

          const templateType = require(`${process.cwd()}/${projectName}/package.json`).templateType;
          const templateMultiPage = templateType == 'multi-page';
          let useLayout;

          //set layout
          co(function*() {
            if (templateMultiPage) {
              useLayout = (yield prompt('Do you need to use layout on server side(Y/N)?')).trim().toLowerCase() === 'y';

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

            //npm install
            let spinner2 = ora('installing...')
            spinner2.start();
            exec(`npm config set registry ${config.npmUrl}`, (error, stdout, stderr) => {
              if (error) {
                console.log(error);
                process.exit();
              }

              exec(`cd ${projectName} && npm install`, (error, stdout, stderr) => {
                if (error) {
                  console.log(error);
                  process.exit();
                }

                // install vic-common
                exec(`npm config set registry ${config.privateNpmUrl}`, (error, stdout, stderr) => {
                  if (error) {
                    console.log(error);
                    process.exit();
                  }

                  exec(`cd ${projectName} && npm install ${config.privateLib} --save-dev`, (error, stdout, stderr) => {
                    if (error) {
                      console.log(error);
                      process.exit();
                    }

                    //reset npm
                    exec(`npm config set registry ${config.npmUrl}`, (error, stdout, stderr) => {
                      spinner2.stop();
                      if (error) {
                        console.log(error);
                        process.exit();
                      }

                      console.log(chalk.green('\n √ Create completed!'));
                      process.exit();
                    });
                  });
                });
              });
            });
          });
        });
    }
  });
};