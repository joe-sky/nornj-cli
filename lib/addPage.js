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
        const { templateName, templateData } = getResourceTemplateData(answers.pageTemplate, njCliConfig.pageTemplates);
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

        //page files
        const pageFiles = fs.readdirSync(`./templates/src/pages/newPage${pageTemplate}`);
        pageFiles.forEach(fileName => {
          fileName = fileName.replace(/\.nornj/, '');
          if (fileName.includes('.e2e.') && !njCliConfig.e2e) {
            return;
          }

          const isNewPageFile = fileName.toLowerCase().startsWith('newpage.'),
            newPageExName = fileName.substr(fileName.indexOf('.'));

          renderFile(
            `./templates/src/pages/newPage${pageTemplate}/${fileName}.nornj`,
            `./src/pages/${pageName}/${isNewPageFile ? n`${pageName + newPageExName} | capitalize` : fileName}`,
            { pageName },
            templateData
          );
        });

        //service files
        renderFile(
          `./templates/src/services/pages/newService${pageTemplate}.${templateData.ts ? 'ts.nornj' : 'js.nornj'}`,
          `./src/services/pages/${pageName}.${templateData.ts ? 'ts' : 'js'}`,
          { pageName },
          templateData
        );

        //store files
        renderFile(
          `./templates/src/stores/pages/newStore${pageTemplate}.${templateData.ts ? 'ts.nornj' : 'js.nornj'}`,
          `./src/stores/pages/${pageName}.${templateData.mobx ? 'store' : 'mst'}.${templateData.ts ? 'ts' : 'js'}`,
          { pageName },
          templateData
        );
        const tmplsRootStore = includeParser(
          fs.readFileSync(`./templates/src/stores/root.mst.js.nornj`, 'utf-8'),
          null,
          nj.tmplRule,
          true
        );
        renderFile(
          `./src/stores/root.mst.js`,
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
          fs.readFileSync(`./templates/src/router/index.js.nornj`, 'utf-8'),
          null,
          nj.tmplRule,
          true
        );
        renderFile(
          `./src/router/index.js`,
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
        renderFile(
          `./src/router/index.js`,
          null,
          createParamsByTemplates(
            tmplsRoutesWeb,
            {
              delimiters: {
                start: '/*{',
                end: '}*/',
                rawStart: '{',
                rawEnd: '}'
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
};
