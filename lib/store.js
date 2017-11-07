'use strict'

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config.json');
const chalk = require('chalk');
const fs = require('fs');
const { getTemplatePath } = require('./utils');
require('./nj.config');

module.exports = () => {
  co(function*() {
    let storeName = yield prompt('Store Name: ');
    fs.readFile(getTemplatePath() + 'store.js', 'utf-8', function(err, data) {
      if (err) {
        throw err;
      }

      const ret = nj.render(data.toString(), {
        storeName
      });

      fs.writeFile(storeName + 'Store.js', ret, 'utf-8', function(err) {
        if (err) {
          throw err;
        }

        console.log(chalk.green('\n √ created store finished!'));
        process.exit();
      });
    });
  })
};