module.exports = {
  EXT: {
    MOBX: 'store',
    MST: 'mst',
    TS: 'ts',
    JS: 'js',
    TSX: 'ts',
    JSX: 'js'
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
  ]
};
