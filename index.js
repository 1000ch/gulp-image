'use strict';
const through2 = require('through2-concurrent');
const PluginError = require('plugin-error');
const optimize = require('./lib/optimize');
const log = require('./lib/log');

module.exports = (options = {}) => through2.obj({
  maxConcurrency: options.concurrent
}, async (file, enc, callback) => {
  if (file.isNull()) {
    return callback(null, file);
  }

  if (file.isStream()) {
    return callback(new Error('gulp-image: Streaming is not supported'));
  }

  try {
    const originalBuffer = file.contents;
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

    const originalBytes = originalBuffer.length;
    const optimizedBytes = optimizedBuffer.length;

    if (!options.quiet) {
      log(file.relative, originalBytes, optimizedBytes);
    }

    if (originalBytes - optimizedBytes > 0) {
      file.contents = optimizedBuffer;
    }

    callback(null, file);
  } catch (error) {
    callback(new PluginError('gulp-image', error));
  }
});
