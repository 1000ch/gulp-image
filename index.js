'use strict';

var fs        = require('fs');
var path      = require('path');
var map       = require('map-stream');
var gutil     = require('gulp-util');
var tempWrite = require('temp-write');
var filesize  = require('filesize');
var chalk     = require('chalk');

var Optimizer = require('./optimizer');
var round10   = require('./round10');

module.exports = function(options) {

  var options = options ? options : {};
  var SUPPORTED_EXTENSION = ['.jpg', '.jpeg', '.png', '.gif', '.svg'];

  return map(function optimizeStream(file, callback) {

    // if file is null
    if (file.isNull()) {
      return callback(null, file);
    }

    // if file is stream
    if (file.isStream()) {
      return callback(new Error('gulp-image: Streaming is not supported'));
    }

    // if file is unsupported image
    if (SUPPORTED_EXTENSION.indexOf(path.extname(file.path).toLowerCase()) === -1) {
      gutil.log('gulp-image: Skipping unsupported image ' + gutil.colors.blue(file.relative));
      return callback(null, file);
    }

    tempWrite(file.contents, path.basename(file.path), function(error, tempFile) {
      if (error) {
        return callback(new gutil.PluginError('gulp-image', error));
      }

      fs.stat(tempFile, function(error, stats) {
        if (error) {
          return callback(new gutil.PluginError('gulp-image', error));
        }

        var originalSize = stats.size;

        var optimizer = new Optimizer({
          src: tempFile,
          dest: tempFile,
          options: options
        });

        optimizer.optimize(function(error, data) {
          if (error) {
            return callback(new gutil.PluginError('gulp-image', error));
          }

          fs.readFile(tempFile, function(error, data) {
            var original = fs.statSync(file.path).size;
            var optimized = fs.statSync(tempFile).size;
            var diff = original - optimized;
            var diffPercent = round10(100 * (diff / original), -1);

            if (diff <= 0) {

              gutil.log(
                chalk.green('- ') + file.relative + chalk.gray(' ->') +
                chalk.gray(' Cannot improve upon ') + chalk.cyan(filesize(original))
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
  }, 10);
};
