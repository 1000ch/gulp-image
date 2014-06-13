# [gulp-image](https://npmjs.org/package/gulp-image)

## About

Optimize PNG, JPEG, GIF, SVG images with gulp task.

[![Build Status](https://travis-ci.org/1000ch/gulp-image.svg?branch=master)](https://travis-ci.org/1000ch/gulp-image)
[![NPM version](https://badge.fury.io/js/gulp-image.svg)](http://badge.fury.io/js/gulp-image)
[![Dependency Status](https://david-dm.org/1000ch/gulp-image.svg)](https://david-dm.org/1000ch/gulp-image)
[![devDependency Status](https://david-dm.org/1000ch/gulp-image/dev-status.svg)](https://david-dm.org/1000ch/gulp-image#info=devDependencies)

## Dependency

`jpeg-recompress` requires `libjpeg-turbo`, so you have to install some libraries before getting `gulp-image`.

### Ubuntu

```sh
$ sudo apt-get install build-essential libjpeg-turbo8 libjpeg-turbo8-dev
```

### Mac OS X

```sh
$ brew install libjpeg libjpeg-turbo
```

## Install

```sh
$ npm install --save-dev gulp-image
```

## Usage

This is `gulpfile.js` sample.

```js
var gulp = require('gulp');
var image = require('gulp-image');

gulp.task('image', function () {
  gulp.src('./fixtures/*')
    .pipe(image())
    .pipe(gulp.dest('./dest'));
});

gulp.task('default', ['image']);
```

## License

MIT