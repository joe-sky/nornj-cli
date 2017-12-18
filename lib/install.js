'use strict';

const { execSync } = require('child_process');
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config.json');
const chalk = require('chalk');
const nj = require('nornj').default;
require('./nj.config');

module.exports = (command = 'install') => {
  co(function*() {
    const pkg = require(`${process.cwd()}/package.json`);
    const deps = [];
    const privateDeps = pkg.njCliConfig.privateLib.split(/\s+/);
    pkg.dependencies && Object.keys(pkg.dependencies).forEach(dep => {
      if (privateDeps.indexOf(dep) < 0) {
        deps.push(dep);
      }
    });
    pkg.devDependencies && Object.keys(pkg.devDependencies).forEach(dep => {
      if (privateDeps.indexOf(dep) < 0) {
        deps.push(dep);
      }
    });

    //npm install
    execSync(`npm ${command} ${deps.join(' ')}`, { stdio: [0, 1, 2] });

    //install private libs
    execSync(`npm ${command} ${pkg.njCliConfig.privateLib} --registry ${config.privateNpmUrl} ${command == 'install' ? '--save-dev' : ''}`, { stdio: [0, 1, 2] });

    console.log(chalk.green(`\n √ ${nj.filters.pascal(command)} completed!`));
    process.exit();
  });
};