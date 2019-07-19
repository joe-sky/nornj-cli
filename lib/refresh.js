const chalk = require('chalk');
const path = require('path');
const { sep } = path;
const { cascadeRenderTemplateFile } = require('./utils');
const { EXT } = require('./constants');

module.exports = () => {
  const pkg = require(`${process.cwd()}/package.json`);
  const njCliConfig = pkg.njCliConfig;
  const templateDataGlobal = njCliConfig.templateData;

  cascadeRenderTemplateFile(
    `${process.cwd()}${sep}templates${sep}project`,
    process.cwd(),
    'project',
    null,
    {
      get store() {
        return templateDataGlobal.mobxRoot ? EXT.MOBX : EXT.MST;
      }
    },
    templateDataGlobal
  );

  console.log(chalk.green('\n √ Refresh completed!'));
  process.exit();
};
