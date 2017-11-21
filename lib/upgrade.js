'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config.json');
const chalk = require('chalk');

module.exports = () => {
  co(function*() {
    const spinner = ora('Upgrading to the latest version...');
    spinner.start();

    exec('npm uninstall nornj-cli -g', (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        process.exit();
      }

      exec('npm i nornj-cli@latest -g', (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          process.exit();
        }

        spinner.stop();
        console.log(chalk.green('\n √ upgrade completed!'));
        process.exit();
      });
    });
  });
};