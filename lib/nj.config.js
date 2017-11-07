const nj = require('nornj').default;

nj.config({
  textMode: true,
  delimiters: {
    start: '{%',
    end: '%}',
    extension: '$',
    prop: '##'
  }
});