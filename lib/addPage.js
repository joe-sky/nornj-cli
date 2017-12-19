'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const {
  getTemplatePath,
  renderFile,
  renderAppendFile
} = require('./utils');
const nj = require('nornj').default;
const includeParser = require('nornj/tools/includeParser');
require('./nj.config');

module.exports = () => {
  co(function*() {
    const pageName = yield prompt('Page Name: ');
    const pkg = require(`${process.cwd()}/package.json`);
    const templateType = pkg.templateType ? pkg.templateType : pkg.njCliConfig.templateType;
    const templateMultiPage = templateType == 'multi-page';
    let useLayout,
      useChart;

    if (templateMultiPage) {
      useLayout = (yield prompt('Do you need to use layout on server side(Y/N)?')).trim().toLowerCase() === 'y';

      //html files
      renderFile(`./templates/resources/htmls/newPage.html`, `./resources/htmls/${pageName}.html`, {
        useLayout,
        pageName
      });

      //server route files
      renderFile(`./templates/server/routes/newPage.js`, `./server/routes/${pageName}.js`);
      renderFile(`./server/app.js`, null, {
        delimiters: {
          start: '/{',
          end: '}/'
        },
        pages: nj.render(fs.readFileSync(`./templates/server/app.js`, 'utf-8').trim(), { pageName })
      });
      renderFile(`./server/devApp.js`, null, {
        delimiters: {
          start: '/{',
          end: '}/'
        },
        pages: nj.render(fs.readFileSync(`./templates/server/devApp.js`, 'utf-8').trim(), { pageName })
      });

      //page resource files
      renderFile(`./templates/src/pages/newPage/container.js`, `./src/pages/${pageName}/container.js`, { pageName });
      renderFile(`./templates/src/pages/newPage/newPage.m.less`, `./src/pages/${pageName}/${pageName}.m.less`);
      renderFile(`./templates/src/pages/newPage/newPage.t.html`, `./src/pages/${pageName}/${pageName}.t.html`);

      //store files
      renderFile(`./templates/src/stores/newPageStore.js`, `./src/stores/${nj.filters.pascal(pageName)}Store.js`, { pageName });
    } else {
      useChart = (yield prompt('Do you want to generate chart page(Y/N)?')).trim().toLowerCase() === 'y';

      //server route files
      renderFile(`./templates/server/routes/newPage${useChart ? 'Chart' : ''}.js`, `./server/routes/${pageName}.js`);
      renderFile(`./server/app.js`, null, {
        delimiters: {
          start: '/{',
          end: '}/'
        },
        pages: nj.render(fs.readFileSync(`./templates/server/app.js`, 'utf-8').trim(), { pageName })
      });

      //page resource files
      renderFile(`./templates/src/web/pages/newPage${useChart ? 'Chart' : ''}/newPage.js`, `./src/web/pages/${pageName}/${pageName}.js`, { pageName });
      renderFile(`./templates/src/web/pages/newPage${useChart ? 'Chart' : ''}/newPage.m.scss`, `./src/web/pages/${pageName}/${pageName}.m.scss`, { pageName });
      renderFile(`./templates/src/web/pages/newPage${useChart ? 'Chart' : ''}/newPage.t.html`, `./src/web/pages/${pageName}/${pageName}.t.html`, { pageName });

      //store files
      renderFile(`./templates/src/stores/pages/newPageStore${useChart ? 'Chart' : ''}.js`, `./src/stores/pages/${pageName}Store.js`, { pageName });
      const tmplsRootStore = includeParser(fs.readFileSync(`./templates/src/stores/rootStore.js`, 'utf-8'), null, nj.tmplRule, true);
      renderFile(`./src/stores/rootStore.js`, null, {
        delimiters: {
          start: '/{',
          end: '}/'
        },
        importStore: nj.render(tmplsRootStore.importStore.trim(), { pageName }),
        pageStore: nj.render(tmplsRootStore.pageStore.trim(), { pageName })
      });

      //router config
      const tmplsRoutesWeb = includeParser(fs.readFileSync(`./templates/routes-web.js`, 'utf-8'), null, nj.tmplRule, true);
      renderFile(`./routes-web.js`, null, {
        delimiters: {
          start: '/{',
          end: '}/'
        },
        importLoadPage: nj.render(tmplsRoutesWeb.importLoadPage.trim(), { pageName }),
        loadPage: nj.render(tmplsRoutesWeb.loadPage.trim(), { pageName }),
        pageComponent: nj.render(tmplsRoutesWeb.pageComponent.trim(), { pageName }),
        route: nj.render(tmplsRoutesWeb.route.trim(), { pageName }),
        clear: /<!--__extraComment__-->/g
      });
    }

    console.log(chalk.green('\n √ created page finished!'));
    process.exit();
  });
};