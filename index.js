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
    if (['.jpg', '.jpeg', '.png', '.gif'].indexOf(path.extname(file.path).toLowerCase()) === -1) {
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
            var optimizedSize = fs.statSync(tempFile).size;
            var diffFileSize = filesize(originalSize - optimizedSize);
            gutil.log(chalk.green('✔ ') + file.relative + chalk.gray(' (' + diffFileSize + ' reduced)'));
            
            file.contents = data;
            callback(null, file);
          });
        });
      });
    });
  },10);
};