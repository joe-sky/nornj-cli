'use strict';

const { execSync } = require('child_process');
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const { getDeps } = require('./utils');
const nj = require('nornj').default;
require('./nj.config');

module.exports = (command = 'install') => {
  co(function*() {
    const pkg = require(`${process.cwd()}/package.json`);
    const deps = getDeps(pkg);

    //npm install
    execSync(`npm ${command} ${deps.join(' ')}`, { stdio: [0, 1, 2] });

    //install private libs
    execSync(`npm ${command} ${pkg.njCliConfig.privateLib} --registry ${pkg.njCliConfig.privateNpmUrl} ${command == 'install' ? '--save-dev' : ''}`, { stdio: [0, 1, 2] });

    console.log(chalk.green(`\n √ ${nj.filters.pascal(command)} completed!`));
    process.exit();
  });
};