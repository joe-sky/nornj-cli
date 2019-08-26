module.exports = {
  EXT: {
    MOBX: 'store',
    MST: 'mst',
    TS: 'ts',
    JS: 'js',
    TSX: 'tsx',
    JSX: 'jsx'
  },

  UNRENDERED_EXT: ['.jpg', '.jpeg', '.png', '.gif', '.ico', '.woff', '.woff2', '.eot', '.ttf', '.otf'],

  sameNameExts: [
    ['.store.js', '.mst.js'],
    ['.store.ts', '.mst.ts'],
    ['.store.ts', '.mst.js'],
    ['.store.js', '.mst.ts']
  ],

  insertTmplDelimiters: [
    {
      start: '/{',
      end: '}/',
      rawStart: '/',
      rawEnd: '/'
    },
    {
      start: '/*{',
      end: '}*/',
      rawStart: '{',
      rawEnd: '}'
    }
  ],

  NOTHING: 'nj-nothing',

  GLOBAL_TEMPLATES_DIR: 'templates',

  TEMPLATES_DIR: '__templates__'
};
