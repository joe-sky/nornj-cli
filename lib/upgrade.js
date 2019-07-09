const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const { CNPM_REGISTRY } = require('./utils');
const argv = require('yargs').argv;

module.exports = () => {
  co(function*() {
    const spinner = ora('Upgrading to the next version...');
    spinner.start();

    exec('npm uninstall nornj-cli -g', (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        process.exit();
      }

      exec('npm i nornj-cli@next -g' + (argv.cnpm ? CNPM_REGISTRY : ''), (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          process.exit();
        }

        spinner.stop();
        console.log(chalk.green('\n √ Upgrade completed!'));
        process.exit();
      });
    });
  });
};
