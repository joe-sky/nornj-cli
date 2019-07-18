const chalk = require('chalk');
const path = require('path');
const { sep } = path;
const {
  cascadeRenderTemplateFile
} = require('./utils');

module.exports = () => {
  const pkg = require(`${process.cwd()}/package.json`);
  const njCliConfig = pkg.njCliConfig;
  const templateDataGlobal = njCliConfig.templateData;

  cascadeRenderTemplateFile(
    `${process.cwd()}${sep}templates${sep}project`,
    process.cwd(),
    'project',
    templateDataGlobal
  );
  console.log(chalk.green('\n √ Refresh completed!'));
  process.exit();
};
