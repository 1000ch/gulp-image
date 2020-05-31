'use strict';

const through2 = require('through2-concurrent');
const PluginError = require('plugin-error');
const colors = require('ansi-colors');
const fancyLog = require('fancy-log');
const filesize = require('filesize');
const {round10} = require('round10');
const optimize = require('./optimize');

module.exports = options => through2.obj({
  maxConcurrency: options ? options.concurrent : null
}, async (file, enc, callback) => {
  if (file.isNull()) {
    return callback(null, file);
  }

  if (file.isStream()) {
    return callback(new Error('gulp-image: Streaming is not supported'));
  }

  const log = options && options.quiet ? () => {} : fancyLog;

  try {
    const originalBuffer = file.contents;
    const originalSize = originalBuffer.length;
    const optimizedBuffer = await optimize(originalBuffer, {
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      ...options
    });
    const optimizedSize = optimizedBuffer.length;
    const diffSize = originalSize - optimizedSize;
    const diffPercent = round10(100 * (diffSize / originalSize), -1);

    if (diffSize === 0) {
      log('gulp-image: Optimization is skipped ' + colors.blue(file.relative));
    } else if (diffSize < 0) {
      log(
        colors.green('- ') + file.relative + colors.gray(' ->') +
        colors.gray(' Cannot improve upon ') + colors.cyan(filesize(originalSize))
      );
    } else {
      file.contents = optimizedBuffer;

      log(
        colors.green('✔ ') + file.relative + colors.gray(' ->') +
        colors.gray(' before=') + colors.yellow(filesize(originalSize)) +
        colors.gray(' after=') + colors.cyan(filesize(optimizedSize)) +
        colors.gray(' reduced=') + colors.green(filesize(diffSize) + '(' + diffPercent + '%)')
      );
    }

    callback(null, file);
  } catch (error) {
    callback(new PluginError('gulp-image', error));
  }
});
