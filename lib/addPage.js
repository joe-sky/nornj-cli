'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config.json');
const chalk = require('chalk');
const fs = require('fs');
const {
  getTemplatePath,
  renderFile,
  renderAppendFile,
  TEMPLATES_MULTI_PAGE
} = require('./utils');
const nj = require('nornj').default;
require('./nj.config');

module.exports = () => {
  co(function*() {
    const tmplName = yield prompt('Template Name: ');
    const pageName = yield prompt('Page Name: ');
    const templateMultiPage = TEMPLATES_MULTI_PAGE.indexOf(tmplName) > -1;

    let useLayout;
    if (templateMultiPage) {
      useLayout = (yield prompt('Do you need to use layout on server side(Y/N)?')).trim().toLowerCase() === 'y';
    }
    else {
      console.log(chalk.green('\n × There is no support for adding pages temporarily.'));
      process.exit();
    }

    //html files
    renderFile(`./templates/resources/htmls/newPage.html`, `./resources/htmls/${pageName}.html`, {
      useLayout,
      pageName
    });

    //server route files
    renderFile(`./templates/server/routes/newPage.js`, `./server/routes/${pageName}.js`);
    renderAppendFile(`./templates/server/devApp.js`, `./server/devApp.js`, 2, { pageName });

    //page resource files
    renderFile(`./templates/src/pages/newPage/container.js`, `./src/pages/${pageName}/container.js`, { pageName });
    renderFile(`./templates/src/pages/newPage/newPage.m.less`, `./src/pages/${pageName}/newPage.m.less`);
    renderFile(`./templates/src/pages/newPage/newPage.t.html`, `./src/pages/${pageName}/newPage.t.html`);

    //store files
    renderFile(`./templates/src/stores/newPageStore.js`, `./src/stores/${nj.filters.pascal(pageName)}Store.js`, { pageName });

    console.log(chalk.green('\n √ created page finished!'));
    process.exit();
  });
};