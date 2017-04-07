'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import clean from 'gulp-clean';

const dirs = {
  src: 'src',
  dist: 'dist'
};

const sassPaths = {
  src: `${dirs.src}/**/*.scss`,
  dist: `${dirs.dist}`
};

const fontPaths = {
  src: `${dirs.src}/style/fonts/**`,
  dist: `${dirs.dist}/style/fonts`
};

const babelPaths = {
  src: `${dirs.src}/**/*.js`,
  dist: `${dirs.dist}`
};

gulp.task('clean', () => {
  return gulp.src(dirs.dist, {read: false})
  .pipe(clean());
});

gulp.task('styles', ['fonts'], () => {
  return gulp.src(sassPaths.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(sassPaths.dist));
});

gulp.task('fonts', ['clean'], () => {
  return gulp.src(fontPaths.src)
  .pipe(gulp.dest(fontPaths.dist));
});

gulp.task('build', ['styles'], () => {
  return gulp.src(babelPaths.src)
  .pipe(babel())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(babelPaths.dist));
});
