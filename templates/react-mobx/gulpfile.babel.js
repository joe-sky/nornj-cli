import gulp from 'gulp';
import gutil from 'gulp-util';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import template from 'gulp-template';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import gulpif from 'gulp-if';
import notify from 'gulp-notify';
import env from 'gulp-env';
import nodemon from 'gulp-nodemon';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config';
import { argv } from 'yargs';
import configs from './configs';
import { create } from 'browser-sync';
const browserSync = create();

//获取配置文件
function getConfig() {
  let type = 'local';
  if (argv.web) {
    type = 'web';
  }

  let cfgs = configs[argv.dev ? 'dev' : type];
  if (useBrowserSync && type === 'web') {
    cfgs = Object.assign({}, cfgs, { webDomain: cfgs.webDomain.replace(/:[\d]+$/, '') + ':' + cfgs.bs.port });
  }
  if (argv.src) {
    cfgs = Object.assign({}, cfgs, { resourcePath: cfgs.resourcePathSrc, indexPath: cfgs.indexPathSrc });
  }

  return cfgs;
}

//构建错误处理
function handleError() {
  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, arguments);

  // Keep gulp from hanging on this task
  this.emit('end');
}

//构建js
gulp.task('build-js', () => {
  return gulp.src('./src/entry.js')
    .pipe(env.set({
      BABEL_ENV: 'webpack'
    }))
    .pipe(webpackStream(
      webpackConfig(webpack, getConfig(), argv.p, (argv.w || useBrowserSync) ? true : false),
      webpack))
    .on('error', handleError)
    .pipe(gulp.dest(getConfig().resourcePath + 'app'))
    .pipe(gulpif(useBrowserSync, browserSync.reload({ stream: true })));
});

//复制第三方框架文件
gulp.task('build-lib', () => {
  const config = getConfig();

  //font-awesome
  gulp.src('./node_modules/font-awesome/css/*.*')
    .pipe(gulp.dest(getConfig().resourcePath + 'libs/font-awesome/css'));
  gulp.src('./node_modules/font-awesome/fonts/*.*')
    .pipe(gulp.dest(getConfig().resourcePath + 'libs/font-awesome/fonts'));

  return gulp.src([
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/js-cookie/src/js.cookie.js',
      './node_modules/es6-promise/dist/*.js',
      './node_modules/flarej/vendor/babelHelpers.min.js'
    ])
    .pipe(gulp.dest(getConfig().resourcePath + 'libs'));
});

//构建html
gulp.task('build-html', done => {
  const config = getConfig();

  gulp.src('./resources/htmls/**/*.html')
    .pipe(template({
      webDomain: config.webDomain,
      ver: config.ver,
      web: argv.web
    }))
    .pipe(rename({ extname: config.indexExtName }))
    .pipe(gulp.dest(config.indexPath))
    .on('end', () => {
      useBrowserSync && browserSync.reload();
      done();
    });
});

//监测html文件变化
gulp.task("watch-html", () => {
  gulp.watch('./resources/htmls/**/*.html', ['build-html']);
  gulp.start('build-html');
});

//复制图片文件
gulp.task('build-img', () => {
  return gulp.src('./resources/images/index/**/*.*')
    .pipe(gulp.dest(getConfig().resourcePath + 'images/index'));
});

//编译后自动刷新浏览器
let useBrowserSync = false;
gulp.task('bs', () => {
  useBrowserSync = true;
  gulp.start('build-js');
  gulp.start('build-lib');
  gulp.start('build-img');
  gulp.start('watch-html');

  browserSync.init(Object.assign({
    open: false,
    ghostMode: false
  }, getConfig().bs));
});

//启动测试服务器
let nodemonStart = false;
gulp.task('server', done => {
  const params = {
    script: 'server/app.js',
    watch: [
      'server/app.js',
      'server/routes/**/*.js',
      'server/common/**/*.js'
    ]
  };
  if (argv.hmr) {
    gulp.start('build-lib');
    gulp.start('build-img');
    gulp.start('watch-html');

    useBrowserSync = true;
    browserSync.init(Object.assign({
      open: false,
      ghostMode: false
    }, getConfig().bs));
  }

  nodemon(params).on('start', () => {
    if (!nodemonStart) {
      nodemonStart = true;
      done();
    }
  });
});

//默认任务
let defaultTasks = ['build-js', 'build-lib', 'build-img'];
if (argv.w) {
  defaultTasks.push('watch-html');
} else {
  defaultTasks.push('build-html');
}
gulp.task('default', defaultTasks);