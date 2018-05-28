module.exports = {
  plugins: [
    require('postcss-smart-import')({  }),
    require('precss')({  }),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 0%', 'Firefox > 20', 'IE 9'],
      cascade: false
    })
  ]
}