'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config.json');
const chalk = require('chalk');
const fs = require('fs');
const { getTemplatePath } = require('./utils');
const nj = require('nornj').default;
require('./nj.config');

module.exports = () => {
  co(function*() {
    const tmplName = yield prompt('Template Name: ');
    const pageName = yield prompt('Page Name: ');
    const useLayout = (yield prompt('Do you need to use layout on server side(Y/N)?')).trim().toLowerCase() === 'y';

    //html file
    renderFile(`${getTemplatePath()}${tmplName}/resources/htmls/newPage.html`, `./resources/htmls/common/${pageName}.html`, {
      useLayout,
      pageName
    });

    console.log(chalk.green('\n √ created page finished!'));
    process.exit();

    // fs.readFile(getTemplatePath() + 'store.js', 'utf-8', function(err, data) {
    //   if (err) {
    //     throw err;
    //   }

    //   const ret = nj.render(data.toString(), {
    //     pageName
    //   });

    //   fs.writeFile(pageName + 'Store.js', ret, 'utf-8', function(err) {
    //     if (err) {
    //       throw err;
    //     }

    //     console.log(chalk.green('\n √ created store finished!'));
    //     process.exit();
    //   });
    // });
  })
};