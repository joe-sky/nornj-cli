const nj = require('nornj/dist/nornj.common').default;
const includeParser = require('nornj/tools/includeParser');

nj.config({
  textMode: true,
  delimiters: {
    start: '{%',
    end: '%}',
    extension: '#',
    prop: '@',
    template: '#template',
    comment: '%'
  },
  fixTagName: false,
  includeParser
});

nj.registerFilter('judge', (val, val1, val2) => (val ? val1 : val2));
