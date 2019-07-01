module.exports = {
  plugins: [
    require('postcss-custom-properties')({
      preserve: false
    }),
    require('postcss-import')({}),
    require('precss')({}),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 0%', 'Firefox > 20', 'IE 9'],
      cascade: false
    })
  ]
};
