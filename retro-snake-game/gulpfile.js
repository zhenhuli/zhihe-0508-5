const gulp = require('gulp');
const connect = require('gulp-connect');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
  html: 'src/*.html',
  css: 'src/css/*.css',
  js: [
    'src/js/config.js',
    'src/js/storage.js',
    'src/js/snake.js',
    'src/js/food.js',
    'src/js/renderer.js',
    'src/js/ui.js',
    'src/js/game.js',
    'src/js/app.js'
  ],
  dist: 'dist/'
};

function html() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.dist))
    .pipe(connect.reload());
}

function css() {
  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist + 'css'))
    .pipe(connect.reload());
}

function js() {
  return gulp.src(paths.js)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.dist + 'js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist + 'js'))
    .pipe(connect.reload());
}

function watch() {
  gulp.watch(paths.html, html);
  gulp.watch(paths.css, css);
  gulp.watch(paths.js, js);
}

function serve() {
  connect.server({
    root: 'dist',
    port: 3000,
    livereload: true
  });
}

exports.html = html;
exports.css = css;
exports.js = js;
exports.watch = watch;
exports.serve = serve;
exports.build = gulp.parallel(html, css, js);
exports.dev = gulp.series(exports.build, gulp.parallel(serve, watch));
