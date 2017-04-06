'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';

const dirs = {
  src: 'src',
  dest: 'build'
};

const sassPaths = {
  src: `${dirs.src}/app.scss`,
  dest: `${dirs.dest}/styles/`
};

const babelPaths = {
  src: `${dirs.src}/**/*.js`,
  dest: `${dirs.dest}/js/`
};

gulp.task('styles', () => {
  return gulp.src(sassPaths.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(sassPaths.dest));
});


gulp.task('build', ['styles'], () => {
  return gulp.src(babelPaths.src)
  .pipe(babel())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(babelPaths.dest));
});
