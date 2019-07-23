const chalk = require('chalk');
const path = require('path');
const { sep } = path;
const { getNjCliConfig, cascadeRenderTemplateFile } = require('./utils');
const { EXT } = require('./constants');

module.exports = () => {
  const njCliConfig = getNjCliConfig();
  const templateDataGlobal = njCliConfig.templateData;

  cascadeRenderTemplateFile(
    `${process.cwd()}${sep}templates${sep}project`,
    process.cwd(),
    'project',
    null,
    {
      refresh: true,
      get store() {
        return templateDataGlobal.mobxRoot ? EXT.MOBX : EXT.MST;
      },
      get ext() {
        return templateDataGlobal.ts ? EXT.TS : EXT.JS;
      },
      get extx() {
        return templateDataGlobal.ts ? EXT.TSX : EXT.JSX;
      }
    },
    templateDataGlobal
  );

  console.log(chalk.green('\n √ Refresh completed!'));
  process.exit();
};
