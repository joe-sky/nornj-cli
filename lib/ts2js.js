const babel = require('@babel/core');
const format = require('prettier-eslint');
const presetTypescript = require('@babel/preset-typescript').default;
const pluginSyntaxDecorators = require('@babel/plugin-syntax-decorators').default;
const pluginSyntaxDynamicImport = require('@babel/plugin-syntax-dynamic-import').default;

function ts2js(code) {
  return format({
    text: babel.transformSync(code, {
      retainLines: true,
      presets: [[presetTypescript, { allExtensions: true, isTSX: true }]],
      plugins: [[pluginSyntaxDecorators, { decoratorsBeforeExport: true }], pluginSyntaxDynamicImport]
    }).code,
    prettierOptions: {
      parser: 'babel',
      allowSuperOutsideMethod: true,
      printWidth: 120,
      tabWidth: 2,
      singleQuote: true,
      semi: true,
      jsxBracketSameLine: true
    }
  });
}

module.exports = {
  ts2js
};
