'use strict'

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config.json');
const chalk = require('chalk');
const fs = require('fs');
const unzip = require('unzip');
const { getTemplatePath } = require('./utils');
require('./nj.config');

module.exports = () => {
  co(function*() {
    const tmplName = yield prompt('Template Name: ');
    const projectName = yield prompt('Project Name: ');
    const tmplPath = getTemplatePath() + tmplName + '.zip';

    if (!fs.existsSync(tmplPath)) {
      console.log(chalk.red('\n x Template does not exist!'));
      process.exit();
    }

    let spinner = ora('Unzipping files...');
    spinner.start();

    fs.createReadStream(getTemplatePath() + tmplName + '.zip')
      .pipe(unzip.Extract({ path: projectName }))
      .on('close', function() {
        spinner.stop();
        console.log(chalk.green('\n √ Unzip competed.'));

        //npm install
        let spinner2 = ora('installing...')
        spinner2.start();
        exec(`cd ${projectName} && npm install`, (error, stdout, stderr) => {
          if (error) {
            console.log(error);
            process.exit();
          }

          // install vic-common
          exec(`npm config set registry http://192.168.151.68:8001`, (error, stdout, stderr) => {
            if (error) {
              console.log(error);
              process.exit();
            }

            exec(`cd ${projectName} && npm install vic-common`, (error, stdout, stderr) => {
              if (error) {
                console.log(error);
                process.exit();
              }

              //reset npm
              exec(`npm config set registry https://registry.npmjs.org`, (error, stdout, stderr) => {
                spinner2.stop();
                if (error) {
                  console.log(error);
                  process.exit();
                }

                console.log(chalk.green('\n √ Create competed!'));
                process.exit();
              });
            });
          });
        });
      });
  });
};