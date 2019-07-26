module.exports = {
  EXT: {
    MOBX: 'store',
    MST: 'mst',
    TS: 'ts',
    JS: 'js',
    TSX: 'tsx',
    JSX: 'jsx'
  },

  sameNameExts: [
    ['.js', '.ts'],
    ['.jsx', '.tsx'],
    ['.store.js', '.mst.js', '.store.ts', '.mst.ts'],
    ['.less', '.sass']
  ],

  insertTmplDelimiters: [
    {
      start: '/{',
      end: '}/'
    },
    {
      start: '/*{',
      end: '}*/',
      rawStart: '{',
      rawEnd: '}'
    }
  ],

  NOTHING: 'nj-nothing',

  TEMPLATES_DIR: '__templates__'
};
