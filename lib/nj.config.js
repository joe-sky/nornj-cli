const nj = require('nornj').default;
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

nj.registerExtension({
  nothing: () => 'nj-nothing'
});
