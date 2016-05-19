'use strict';

const fs = require('fs');
const path = require('path');
const mapStream = require('map-stream');
const gutil = require('gulp-util');
const tempWrite = require('temp-write');
const filesize = require('filesize');
const chalk = require('chalk');

const Optimizer = require('./optimizer');
const round10 = require('./round10');

module.exports = function(options) {
  const defaultOptions = {
    pngquant       : true,
    optipng        : false,
    zopflipng      : true,
    advpng         : true,
    jpegRecompress : false,
    jpegoptim      : true,
    mozjpeg        : true,
    gifsicle       : true,
    svgo           : true
  };

  return mapStream((file, callback) => {
    if (file.isNull()) {
      return callback(null, file);
    }

    if (file.isStream()) {
      return callback(new Error('gulp-image: Streaming is not supported'));
    }

    let extension = path.extname(file.path).toLowerCase();

    if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].indexOf(extension) === -1) {
      gutil.log('gulp-image: Skipping unsupported image ' + gutil.colors.blue(file.relative));
      return callback(null, file);
    }

    let tempFile = tempWrite.sync(file.contents, path.basename(file.path));

    let optimizer = new Optimizer({
      src     : tempFile,
      options : Object.assign({}, defaultOptions, options || {})
    });

    optimizer
      .optimize()
      .then(() => {
        fs.readFile(tempFile, function(error, data) {
          let original = fs.statSync(file.path).size;
          let optimized = fs.statSync(tempFile).size;
          let diff = original - optimized;
          let diffPercent = round10(100 * (diff / original), -1);

          if (diff <= 0) {
            gutil.log(
              chalk.green('- ') + file.relative + chalk.gray(' ->') +
              chalk.gray(' Cannot improve upon ') + chalk.cyan(filesize(original))
            );
          } else {
            file.contents = data;
            gutil.log(
              chalk.green('✔ ') + file.relative + chalk.gray(' ->') +
              chalk.gray(' before=') + chalk.yellow(filesize(original)) +
              chalk.gray(' after=') + chalk.cyan(filesize(optimized)) +
              chalk.gray(' reduced=') + chalk.green.underline(filesize(diff) + '(' + diffPercent + '%)')
            );
          }

          callback(null, file);
        });
      })
      .catch(error => {
        callback(new gutil.PluginError('gulp-image', error));
      });
  }, 10);
};
