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
    console.log(chalk.green(require("../package.json").version));
    process.exit();
  });
};