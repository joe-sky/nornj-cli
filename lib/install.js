'use strict';

const { execSync } = require('child_process');
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const { getDeps } = require('./utils');
const nj = require('nornj').default;
require('./nj.config');

module.exports = (command = 'install') => {
  co(function*() {
    const pkgPath = `${process.cwd()}/package.json`;
    const pkg = require(pkgPath);
    const pkgDeps = getDeps(pkg, true);

    if (command == 'install' && !fs.existsSync(`${process.cwd()}/node_modules`)) {
      let fileTxt = fs.readFileSync(pkgPath, 'utf-8');
      fileTxt = fileTxt.replace(new RegExp('"(' + pkg.njCliConfig.privateLib.split(/\s+/).join('|') + ')":[\\s]*"[^"]+"[,]?', 'g'), '');
      fs.writeFileSync(pkgPath, fileTxt);
    }

    //npm install
    execSync(`npm ${command} ${pkgDeps.deps.join(' ')}`, { stdio: [0, 1, 2] });

    //install private libs
    execSync(`npm ${command == 'update' ? 'install' : command} ${command == 'install' ? pkg.njCliConfig.privateLib : pkgDeps.privateDeps.join(' ')} --registry ${pkg.njCliConfig.privateNpmUrl} ${command == 'install' ? '--save-dev' : ''}`, { stdio: [0, 1, 2] });

    console.log(chalk.green(`\n √ ${nj.filters.pascal(command)} completed!`));
    process.exit();
  });
};