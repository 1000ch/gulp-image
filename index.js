'use strict';

const path = require('path');
const through2 = require('through2-concurrent');
const gutil = require('gulp-util');
const filesize = require('filesize');
const optimize = require('./optimize');
const round10 = require('./round10');

module.exports = options => through2.obj({
  maxConcurrency: options ? options.concurrent : null
}, (file, enc, callback) => {
  if (file.isNull()) {
    return callback(null, file);
  }

  if (file.isStream()) {
    return callback(new Error('gulp-image: Streaming is not supported'));
  }

  const extension = path.extname(file.path).toLowerCase();

  if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].indexOf(extension) === -1) {
    gutil.log('gulp-image: Skipping unsupported image ' + gutil.colors.blue(file.relative));
    return callback(null, file);
  }

  optimize(file.contents, Object.assign({
    pngquant       : true,
    optipng        : false,
    zopflipng      : true,
    jpegRecompress : false,
    jpegoptim      : true,
    mozjpeg        : true,
    gifsicle       : true,
    svgo           : true
  }, options)).then(buffer => {
    const before = file.contents.length;
    const after = buffer.length;
    const diff = before - after;
    const diffPercent = round10(100 * (diff / before), -1);

    if (diff <= 0) {
      gutil.log(
        gutil.colors.green('- ') + file.relative + gutil.colors.gray(' ->') +
        gutil.colors.gray(' Cannot improve upon ') + gutil.colors.cyan(filesize(before))
      );
    } else {
      file.contents = buffer;

      gutil.log(
        gutil.colors.green('✔ ') + file.relative + gutil.colors.gray(' ->') +
        gutil.colors.gray(' before=') + gutil.colors.yellow(filesize(before)) +
        gutil.colors.gray(' after=') + gutil.colors.cyan(filesize(after)) +
        gutil.colors.gray(' reduced=') + gutil.colors.green.underline(filesize(diff) + '(' + diffPercent + '%)')
      );
    }

    callback(null, file);
  }).catch(error => {
    callback(new gutil.PluginError('gulp-image', error));
  });
});
