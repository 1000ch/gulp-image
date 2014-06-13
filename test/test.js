'use strict';

var fs = require('fs');
var assert = require('assert');
var gutil = require('gulp-util');
var image = require('../index');

it('should minify PNG images', function (callback) {
  this.timeout(false);

  var stream = image();

  stream.on('data', function (file) {
    assert(file.contents.length < fs.statSync('test/fixtures/test.png').size);
    callback();
  });

  stream.write(new gutil.File({
    path: __dirname + '/fixtures/test.png',
    contents: fs.readFileSync('test/fixtures/test.png')
  }));
});

it('should minify JPG images', function (callback) {
  this.timeout(false);

  var stream = image();

  stream.on('data', function (file) {
    assert(file.contents.length < fs.statSync('test/fixtures/test.jpg').size);
    callback();
  });

  stream.write(new gutil.File({
    path: __dirname + '/fixtures/test.jpg',
    contents: fs.readFileSync('test/fixtures/test.jpg')
  }));
});

it('should minify GIF images', function (callback) {
  this.timeout(false);

  var stream = image();

  stream.on('data', function (file) {
    assert(file.contents.length < fs.statSync('test/fixtures/test.gif').size);
    callback();
  });

  stream.write(new gutil.File({
    path: __dirname + '/fixtures/test.gif',
    contents: fs.readFileSync('test/fixtures/test.gif')
  }));
});

it('should minify SVG images', function (callback) {
  this.timeout(false);

  var stream = image();

  stream.on('data', function (file) {
    assert(file.contents.length < fs.statSync('test/fixtures/test.svg').size);
    callback();
  });

  stream.write(new gutil.File({
    path: __dirname + '/fixtures/test.svg',
    contents: fs.readFileSync('test/fixtures/test.svg')
  }));
});

it('should skip unsupported images', function (callback) {
  var stream = image();

  stream.on('data', function (file) {
    assert.strictEqual(file.contents, null);
    callback();
  });

  stream.write(new gutil.File({
    path: __dirname + 'fixtures/test.bmp'
  }));
});