'use strict';

var fs = require('graceful-fs');
var path = require('path');

var map = require('map-stream');
var gutil = require('gulp-util');
var tempWrite = require('temp-write');
var filesize = require('filesize');
var chalk = require('chalk');

var Optimizer = require('./lib/optimizer');

module.exports = function (options) {

  var options = options ? options : {};

  return map(function optimizeStream (file, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new Error('gulp-image: Streaming is not supported'));
    }
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].indexOf(path.extname(file.path).toLowerCase()) === -1) {
      gutil.log('gulp-image: Skipping unsupported image ' + gutil.colors.blue(file.relative));
      return callback(null, file);
    }
    tempWrite(file.contents, path.basename(file.path), function (error, tempFile) {
      if (error) {
        return callback(new gutil.PluginError('gulp-image', error));
      }
      fs.stat(tempFile, function (error, stats) {
        if (error) {
          return callback(new gutil.PluginError('gulp-image', error));
        }
        var originalSize = stats.size;

        var optimizer = new Optimizer({
          src: tempFile,
          dest: tempFile,
          options: options
        });

        optimizer.optimize(function (error, data) {
          if (error) {
            return callback(new gutil.PluginError('gulp-image', error));
          }
          fs.readFile(tempFile, function (error, data) {
            var original = fs.statSync(file.path).size;
            var optimized = fs.statSync(tempFile).size;
            var diff = original - optimized;
            var diffPercent = _round10(100 * (diff / original), -1);

            if (diff <= 0) {

              gutil.log(
                chalk.green('- ') + file.relative + chalk.gray(' ->') +
                chalk.gray(" Can't improve upon ") + chalk.cyan(filesize(original))
              );

            } else {

              gutil.log(
                chalk.green('✔ ') + file.relative + chalk.gray(' ->') +
                chalk.gray(' before=') + chalk.yellow(filesize(original)) +
                chalk.gray(' after=') + chalk.cyan(filesize(optimized)) +
                chalk.gray(' reduced=') + chalk.green.underline(filesize(diff) + '(' + diffPercent + '%)')
              );

              file.contents = data;
            }

            callback(null, file);
          });
        });
      });
    });
  },10);
};

// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function _round10(value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math.round(value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}
