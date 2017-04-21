# [gulp-image](https://npmjs.org/package/gulp-image)

Optimize PNG, JPEG, GIF, SVG images with gulp task.

[![Build Status](https://travis-ci.org/1000ch/gulp-image.svg?branch=master)](https://travis-ci.org/1000ch/gulp-image)
[![NPM version](https://badge.fury.io/js/gulp-image.svg)](http://badge.fury.io/js/gulp-image)
[![Dependency Status](https://david-dm.org/1000ch/gulp-image.svg)](https://david-dm.org/1000ch/gulp-image)
[![devDependency Status](https://david-dm.org/1000ch/gulp-image/dev-status.svg)](https://david-dm.org/1000ch/gulp-image#type=dev)

![](https://raw.github.com/1000ch/gulp-image/master/screenshot/terminal.png)


## Install

```bash
$ npm install --save-dev gulp-image
```

### External Dendencies

- `brew install libjpeg libpng` on macOS
- `apt-get install -y libjpeg libpng` on Ubuntu

## Usage

This is an example of `gulpfile.js`.

```javascript
const gulp = require('gulp');
const image = require('gulp-image');

gulp.task('image', function () {
  gulp.src('./fixtures/*')
    .pipe(image())
    .pipe(gulp.dest('./dest'));
});

gulp.task('default', ['image']);
```

You can pass an object to `image()` as argument such as following:

```javascript
gulp.task('image', function () {
  gulp.src('./fixtures/*')
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      jpegoptim: true,
      mozjpeg: true,
      guetzli: false,
      gifsicle: true,
      svgo: true,
      concurrent: 10
    }))
    .pipe(gulp.dest('./dest'));
});
```

Set `false` for optimizers which you don't want to apply. And you can set `concurrent` option to limit the max concurrency in execution.

Optionally you may pass enable and disable options to [svgo](https://github.com/svg/svgo):

```javascript
gulp.task('image', function () {
  gulp.src('./fixtures/*')
    .pipe(image({
      svgo: { enable: ["removeRasterImages"], disable: ["removeDoctype"] }
    }))
    .pipe(gulp.dest('./dest'));
});
```

## License

[MIT](https://1000ch.mit-license.org) © [Shogo Sensui](https://github.com/1000ch)
