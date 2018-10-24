'use strict';

const exec = require('child_process').exec;
const ora = require('ora');
const git = require('git-exec');
const co = require('co');
const prompt = require('co-prompt');
const chalk = require('chalk');
const fs = require('fs');
const { getTemplatePath, renderFile, renderAppendFile, createParamsByTemplates } = require('./utils');
const nj = require('nornj').default;
const includeParser = require('nornj/tools/includeParser');
require('./nj.config');
const inquirer = require('inquirer');

module.exports = () => {
  let pageName;
  const pkg = require(`${process.cwd()}/package.json`);
  const templateType = pkg.templateType ? pkg.templateType : pkg.njCliConfig.templateType;
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
      renderFile(`./templates/src/stores/newPageStore.js`, `./src/stores/${nj.filters.pascal(pageName)}Store.js`, {
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
          choices: pkg.njCliConfig.pageTemplates ? pkg.njCliConfig.pageTemplates : ['default', 'chart', 'form', 'empty']
        }
      ])
      .then(answers => {
        co(function*() {
          const pageTemplate = answers.pageTemplate === 'default' ? '' : nj.filters.pascal(answers.pageTemplate);
          pageName = process.argv[3];
          if (pageName == null) {
            pageName = yield prompt('Page Name: ');
          }

          //server route files
          renderFile(`./templates/server/routes/newPage${pageTemplate}.js`, `./server/routes/${pageName}.js`);
          renderFile(`./server/app.js`, null, {
            delimiters: {
              start: '/{',
              end: '}/'
            },
            pages: nj.render(fs.readFileSync(`./templates/server/app.js`, 'utf-8'), { pageName })
          });

          //page resource files
          const pageFiles = fs.readdirSync(`./templates/src/web/pages/newPage${pageTemplate}`),
            PAGE_FILE_EX = ['.js', '.jsx'];
          let newPageExName = '',
            hasExName = false;

          pageFiles.forEach(fileName => {
            const isNewPageFile = fileName.toLowerCase().startsWith('newpage.'),
              _newPageExName = fileName.substr(fileName.indexOf('.'));
            if (isNewPageFile && !hasExName) {
              newPageExName = _newPageExName;
              if (PAGE_FILE_EX.indexOf(_newPageExName.toLowerCase()) >= 0) {
                hasExName = true;
              }
            }

            renderFile(
              `./templates/src/web/pages/newPage${pageTemplate}/${fileName}`,
              `./src/web/pages/${pageName}/${isNewPageFile ? pageName + _newPageExName : fileName}`,
              { pageName }
            );
          });

          //store files
          renderFile(
            `./templates/src/stores/pages/newPageStore${pageTemplate}.js`,
            `./src/stores/pages/${pageName}Store.js`,
            { pageName }
          );
          const tmplsRootStore = includeParser(
            fs.readFileSync(`./templates/src/stores/rootStore.js`, 'utf-8'),
            null,
            nj.tmplRule,
            true
          );
          renderFile(
            `./src/stores/rootStore.js`,
            null,
            createParamsByTemplates(
              tmplsRootStore,
              { pageName },
              {
                delimiters: {
                  start: '/{',
                  end: '}/'
                }
              }
            )
          );

          //router config
          const tmplsRoutesWeb = includeParser(
            fs.readFileSync(`./templates/routes-web.js`, 'utf-8'),
            null,
            nj.tmplRule,
            true
          );
          renderFile(
            `./routes-web.js`,
            null,
            createParamsByTemplates(
              tmplsRoutesWeb,
              {
                pageName,
                exName: newPageExName
              },
              {
                delimiters: {
                  start: '/{',
                  end: '}/'
                }
              }
            )
          );

          console.log(chalk.green('\n √ Created page finished!'));
          process.exit();
        });
      });
  }
};
