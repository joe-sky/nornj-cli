const babel = require('@babel/core');
const format = require('prettier-eslint');

function ts2js(code) {
  return format({
    text: babel.transformSync(code, {
      retainLines: true,
      presets: [['@babel/typescript', { allExtensions: true, isTSX: true }]],
      plugins: [
        ['@babel/plugin-syntax-decorators', { decoratorsBeforeExport: true }],
        '@babel/plugin-syntax-dynamic-import'
      ]
    }).code,
    prettierOptions: {
      parser: 'babel'
    }
  });
}

module.exports = {
  ts2js
};
