const nj = require('nornj/dist/nornj.common').default;

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
  fixTagName: false
});
