# [gulp-image](https://npmjs.org/package/gulp-image)

## About

Optimize PNG, JPEG, GIF, SVG images with gulp task.

[![Build Status](https://travis-ci.org/1000ch/gulp-image.svg?branch=master)](https://travis-ci.org/1000ch/gulp-image)
[![NPM version](https://badge.fury.io/js/gulp-image.svg)](http://badge.fury.io/js/gulp-image)
[![Dependency Status](https://david-dm.org/1000ch/gulp-image.svg)](https://david-dm.org/1000ch/gulp-image)
[![devDependency Status](https://david-dm.org/1000ch/gulp-image/dev-status.svg)](https://david-dm.org/1000ch/gulp-image#info=devDependencies)
[![Analytics](https://ga-beacon.appspot.com/UA-49530352-2/gulp-image/readme)](https://github.com/1000ch/gulp-image)

![](https://raw.github.com/1000ch/gulp-image/master/screenshot/terminal.png)

## Install

```sh
$ npm install --save-dev gulp-image
```

## Usage

This is an example of `gulpfile.js`.

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

MIT: http://1000ch.mit-license.org/
