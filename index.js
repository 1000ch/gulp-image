'use strict';

const { extname } = require('path');
const through2 = require('through2-concurrent');
const PluginError = require('plugin-error');
const colors = require('ansi-colors');
const fancyLog = require('fancy-log');
const replaceExtension = require('replace-ext');
const filesize = require('filesize');
const { round10 } = require('round10');
const optimize = require('./optimize');

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];
const NOOP = () => {};

module.exports = options => through2.obj({
  maxConcurrency: options ? options.concurrent : null
}, (file, enc, callback) => {
  if (file.isNull()) {
    return callback(null, file);
  }

  if (file.isStream()) {
    return callback(new Error('gulp-image: Streaming is not supported'));
  }

  const log = options && options.quiet ? NOOP : fancyLog;
  const extension = extname(file.path).toLowerCase();

  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    log('gulp-image: Skipping unsupported image ' + colors.blue(file.relative));
    return callback(null, file);
  }

  optimize(file.contents, Object.assign({
    pngquant       : true,
    optipng        : false,
    zopflipng      : true,
    jpegRecompress : false,
    mozjpeg        : true,
    guetzli        : false,
    gifsicle       : true,
    svgo           : true
  }, options)).then(buffer => {
    const before = file.contents.length;
    const after = buffer.length;
    const diff = before - after;
    const diffPercent = round10(100 * (diff / before), -1);

    if (diff <= 0) {
      log(
        colors.green('- ') + file.relative + colors.gray(' ->') +
        colors.gray(' Cannot improve upon ') + colors.cyan(filesize(before))
      );
    } else {
      file.contents = buffer;

      var sizeBefore      = filesize(before),
          sizeAfter       = filesize(after),
          sizeDiff        = filesize(diff),
          sizeDiffPercent = diffPercent + '%',
          SPACES          = ['', ' ', '  ', '   ', '    ', '     ', '      ', '       ', '        ', '         ', '          '];

      log(
        colors.green('✔') +
        colors.gray(' Before -> ')  + SPACES[(10 - sizeBefore.length)]      + colors.yellow(sizeBefore) +
        colors.gray(' After -> ')   + SPACES[(10 - sizeAfter.length)]       + colors.cyan(sizeAfter) +
        colors.gray(' Reduced -> ') + SPACES[(10 - sizeDiff.length)]        + colors.green(sizeDiff) +
                                      SPACES[(10 - sizeDiffPercent.length)] + colors.green(sizeDiffPercent) +
        colors.gray(' | ')          + file.relative
      );
    }

    callback(null, file);
  }).catch(error => {
    callback(new PluginError('gulp-image', error));
  });
});
