'use strict';

const fs = require('fs');
const assert = require('power-assert');
const gutil = require('gulp-util');
const image = require('../');

it('should minify PNG images with pngquant', function(callback) {
  this.timeout(5000);
  const stream = image({
    pngquant  : true,
    optipng   : false,
    zopflipng : false
  });

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

it('should minify PNG images with optipng', function(callback) {
  this.timeout(5000);
  const stream = image({
    pngquant  : false,
    optipng   : true,
    zopflipng : false
  });

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

it('should minify PNG images with zopflipng', function(callback) {
  this.timeout(5000);
  const stream = image({
    pngquant  : false,
    optipng   : false,
    zopflipng : true
  });

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

it('should not minify PNG images when related options are disabled', function(callback) {
  this.timeout(5000);
  const stream = image({
    pngquant  : false,
    optipng   : false,
    zopflipng : false
  });

  stream.on('data', file => {
    let before = fs.statSync('test/fixtures/test.png').size;
    let after  = file.contents.length;
    assert(after === before);
  });

  stream.on('end', callback);

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync('test/fixtures/test.png')
  }));

  stream.end();
});

it('should minify JPG images with jpegRecompress', function(callback) {
  this.timeout(5000);
  const stream = image({
    jpegRecompress : true,
    jpegoptim      : false,
    mozjpeg        : false
  });

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

it('should minify JPG images with jpegoptim', function(callback) {
  this.timeout(5000);
  const stream = image({
    jpegRecompress : false,
    jpegoptim      : true,
    mozjpeg        : false
  });

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

it('should minify JPG images with mozjpeg', function(callback) {
  this.timeout(5000);
  const stream = image({
    jpegRecompress : false,
    jpegoptim      : false,
    mozjpeg        : true
  });

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

it('should not minify JPG images when related options are disabled', function(callback) {
  this.timeout(5000);
  const stream = image({
    jpegRecompress : false,
    jpegoptim      : false,
    mozjpeg        : false
  });

  stream.on('data', file => {
    let before = fs.statSync('test/fixtures/test.jpg').size;
    let after  = file.contents.length;
    assert(after === before);
  });

  stream.on('end', callback);

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync('test/fixtures/test.jpg')
  }));

  stream.end();
});

it('should minify GIF images', function(callback) {
  this.timeout(5000);
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

it('should not minify GIF images when related options are disabled', function(callback) {
  this.timeout(5000);
  const stream = image({
    gifsicle : false
  });

  stream.on('data', file => {
    let before = fs.statSync('test/fixtures/test.gif').size;
    let after  = file.contents.length;
    assert(after === before);
  });

  stream.on('end', callback);

  stream.write(new gutil.File({
    path     :  `${__dirname}/fixtures/test.gif`,
    contents : fs.readFileSync('test/fixtures/test.gif')
  }));

  stream.end();
});

it('should minify SVG images', function(callback) {
  this.timeout(5000);
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

it('should not minify SVG images when related options are disabled', function(callback) {
  this.timeout(5000);
  const stream = image({
    svgo : false
  });

  stream.on('data', file => {
    let before = fs.statSync('test/fixtures/test.svg').size;
    let after  = file.contents.length;
    assert(after === before);
    callback();
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.svg`,
    contents : fs.readFileSync('test/fixtures/test.svg')
  }));
});

it('should skip unsupported images', function(callback) {
  this.timeout(5000);
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
