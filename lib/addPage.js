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
  renderAppendFile,
  createParamsByTemplates,
  getResourceTemplateData
} = require('./utils');
const { default: nj, expression: n } = require('nornj/dist/nornj.common');
const includeParser = require('nornj/tools/includeParser');
require('./nj.config');
const inquirer = require('inquirer');

module.exports = () => {
  let pageName;
  const pkg = require(`${process.cwd()}/package.json`);
  const njCliConfig = pkg.njCliConfig;
  const templateType = pkg.templateType ? pkg.templateType : njCliConfig.templateType;
  const isApp = templateType === 'single-page-app';
  const templateMultiPage = templateType == 'multi-page';

  if (templateMultiPage) {
    co(function*() {
      pageName = yield prompt('Page Name: ');
      const useLayout = (yield prompt('Do you need to use layout on server side? (Y/N)')).trim().toLowerCase() === 'y';

      //html files
      renderFile(`./templates/resources/htmls/newPage.html`, `./resources/htmls/${pageName}.html`, {
        useLayout,
        pageName
      });

      //server files
      renderFile(`./templates/server/routes/newPage.js`, `./server/routes/${pageName}.js`);
      renderFile(`./server/app.js`, null, {
        delimiters: {
          start: '/{',
          end: '}/'
        },
        pages: nj.render(fs.readFileSync(`./templates/server/app.js`, 'utf-8'), { pageName })
      });
      renderFile(`./server/devApp.js`, null, {
        delimiters: {
          start: '/{',
          end: '}/'
        },
        pages: nj.render(fs.readFileSync(`./templates/server/devApp.js`, 'utf-8'), { pageName })
      });

      //page resource files
      renderFile(`./templates/src/pages/newPage/container.js`, `./src/pages/${pageName}/container.js`, { pageName });
      renderFile(`./templates/src/pages/newPage/newPage.m.less`, `./src/pages/${pageName}/${pageName}.m.less`);
      renderFile(`./templates/src/pages/newPage/newPage.t.html`, `./src/pages/${pageName}/${pageName}.t.html`);

      //store files
      renderFile(`./templates/src/stores/newPageStore.js`, `./src/stores/${n`${pageName} | capitalize`}Store.js`, {
        pageName
      });

      console.log(chalk.green('\n √ created page finished!'));
      process.exit();
    });
  } else {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'pageTemplate',
          message: 'Which page template do you want to use?',
          choices: njCliConfig.pageTemplates
            ? njCliConfig.pageTemplates.map(item => (nj.isObject(item) ? (item.alias ? item.alias : item.name) : item))
            : ['default', 'chart', 'form', 'empty']
        }
      ])
      .then(answers => {
        co(function*() {
          const { templateName, templateData } = getResourceTemplateData(
            answers.pageTemplate,
            njCliConfig.pageTemplates
          );
          const pageTemplate = templateName === 'default' ? '' : n`${templateName} | capitalize`;
          pageName = process.argv[3];
          if (pageName == null) {
            pageName = yield prompt('Page Name: ');
          }

          //server route files
          renderFile(
            `./templates/server/routes/newPage${pageTemplate}.js.nornj`,
            `./server/routes/${pageName}.js`,
            templateData
          );
          renderFile(`./server/app.js`, null, {
            delimiters: {
              start: '/{',
              end: '}/'
            },
            pages: nj.render(fs.readFileSync(`./templates/server/app.js.nornj`, 'utf-8'), { pageName }, templateData)
          });

          //page resource files
          const pageFiles = fs.readdirSync(`./templates/src/${isApp ? 'app' : 'web'}/pages/newPage${pageTemplate}`);
          pageFiles.forEach(fileName => {
            fileName = fileName.replace(/\.nornj/, '');
            const isNewPageFile = fileName.toLowerCase().startsWith('newpage.'),
              newPageExName = fileName.substr(fileName.indexOf('.'));

            renderFile(
              `./templates/src/${isApp ? 'app' : 'web'}/pages/newPage${pageTemplate}/${fileName}.nornj`,
              `./src/${isApp ? 'app' : 'web'}/pages/${pageName}/${
                isNewPageFile ? pageName + newPageExName : fileName
              }`,
              { pageName },
              templateData
            );
          });

          //store files
          renderFile(
            `./templates/src/stores/pages/newPageStore${pageTemplate}.${templateData.ts ? 'ts.nornj' : 'js.nornj'}`,
            `./src/stores/pages/${pageName}Store.${templateData.ts ? 'ts' : 'js'}`,
            { pageName },
            templateData
          );
          const tmplsRootStore = includeParser(
            fs.readFileSync(`./templates/src/stores/rootStore${isApp ? 'App' : ''}.js.nornj`, 'utf-8'),
            null,
            nj.tmplRule,
            true
          );
          renderFile(
            `./src/stores/rootStore${isApp ? 'App' : ''}.js`,
            null,
            createParamsByTemplates(
              tmplsRootStore,
              {
                delimiters: {
                  start: '/{',
                  end: '}/'
                }
              },
              { pageName },
              templateData
            ),
            templateData
          );

          //router config
          const tmplsRoutesWeb = includeParser(
            fs.readFileSync(`./templates/routes-${isApp ? 'app' : 'web'}.js.nornj`, 'utf-8'),
            null,
            nj.tmplRule,
            true
          );
          renderFile(
            `./routes-${isApp ? 'app' : 'web'}.js`,
            null,
            createParamsByTemplates(
              tmplsRoutesWeb,
              {
                delimiters: {
                  start: '/{',
                  end: '}/'
                }
              },
              {
                pageName
              },
              templateData
            ),
            templateData
          );

          console.log(chalk.green('\n √ Created page finished!'));
          process.exit();
        });
      });
  }
};
