'use strict';

const fs = require('fs');
const assert = require('power-assert');
const gutil = require('gulp-util');
const image = require('../');

it('should minify PNG images', function(callback) {
  this.timeout(10000);
  const stream = image();

  stream.on('data', file => {
    let before = fs.statSync('test/fixtures/test.png').size;
    let after  = file.contents.length;
    assert(after < before);
  });

  stream.on('end', callback);

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync('test/fixtures/test.png')
  }));

  stream.end();
});

it('should minify JPG images', function(callback) {
  this.timeout(10000);
  const stream = image();

  stream.on('data', file => {
    let before = fs.statSync('test/fixtures/test.jpg').size;
    let after  = file.contents.length;
    assert(after < before);
  });

  stream.on('end', callback);

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync('test/fixtures/test.jpg')
  }));

  stream.end();
});

it('should minify GIF images', function(callback) {
  this.timeout(10000);
  const stream = image();

  stream.on('data', file => {
    let before = fs.statSync('test/fixtures/test.gif').size;
    let after  = file.contents.length;
    assert(after < before);
  });

  stream.on('end', callback);

  stream.write(new gutil.File({
    path     :  `${__dirname}/fixtures/test.gif`,
    contents : fs.readFileSync('test/fixtures/test.gif')
  }));

  stream.end();
});

it('should minify SVG images', function(callback) {
  this.timeout(10000);
  const stream = image();

  stream.on('data', file => {
    let before = fs.statSync('test/fixtures/test.svg').size;
    let after  = file.contents.length;
    assert(after < before);
    callback();
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.svg`,
    contents : fs.readFileSync('test/fixtures/test.svg')
  }));
});

it('should skip unsupported images', function(callback) {
  this.timeout(10000);
  const stream = image();

  stream.on('data', file => {
    assert.strictEqual(file.contents, null);
  });

  stream.on('end', callback);

  stream.write(new gutil.File({
    path : `${__dirname}fixtures/test.bmp`
  }));

  stream.end();
});
