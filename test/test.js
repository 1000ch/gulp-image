'use strict';

const test = require('ava');
const fs = require('fs');
const gutil = require('gulp-util');
const image = require('..');

test('should minify PNG images with pngquant', t => {
  const stream = image({
    pngquant  : true,
    optipng   : false,
    zopflipng : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.png').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.png`)
  }));

  stream.end();
});

test('should minify PNG images with optipng', t => {
  const stream = image({
    pngquant  : false,
    optipng   : true,
    zopflipng : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.png').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.png`)
  }));

  stream.end();
});

test('should minify PNG images with zopflipng', t => {
  const stream = image({
    pngquant  : false,
    optipng   : false,
    zopflipng : true
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.png').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.png`)
  }));

  stream.end();
});

test('should not minify PNG images when related options are disabled', t => {
  const stream = image({
    pngquant  : false,
    optipng   : false,
    zopflipng : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.png').size;
    const after  = file.contents.length;
    t.true(after === before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.png`)
  }));

  stream.end();
});

test('should minify JPG images with jpegRecompress', t => {
  const stream = image({
    jpegRecompress : true,
    jpegoptim      : false,
    mozjpeg        : false,
    guetzli        : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.jpg').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.jpg`)
  }));

  stream.end();
});

test('should minify JPG images with jpegoptim', t => {
  const stream = image({
    jpegRecompress : false,
    jpegoptim      : true,
    mozjpeg        : false,
    guetzli        : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.jpg').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.jpg`)
  }));

  stream.end();
});

test('should minify JPG images with mozjpeg', t => {
  const stream = image({
    jpegRecompress : false,
    jpegoptim      : false,
    mozjpeg        : true,
    guetzli        : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.jpg').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.jpg`)
  }));

  stream.end();
});

test('should minify JPG images with guetzli', t => {
  const stream = image({
    jpegRecompress : false,
    jpegoptim      : false,
    mozjpeg        : false,
    guetzli        : true
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.jpg').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.jpg`)
  }));

  stream.end();
});

test('should not minify JPG images when related options are disabled', t => {
  const stream = image({
    jpegRecompress : false,
    jpegoptim      : false,
    mozjpeg        : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.jpg').size;
    const after  = file.contents.length;
    t.true(after === before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.jpg`)
  }));

  stream.end();
});

test('should minify GIF images', t => {
  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.gif').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     :  `${__dirname}/fixtures/test.gif`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.gif`)
  }));

  stream.end();
});

test('should not minify GIF images when related options are disabled', t => {
  const stream = image({
    gifsicle : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.gif').size;
    const after  = file.contents.length;
    t.true(after === before);
  });

  stream.write(new gutil.File({
    path     :  `${__dirname}/fixtures/test.gif`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.gif`)
  }));

  stream.end();
});

test('should minify SVG images', t => {
  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.svg').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.svg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.svg`)
  }));
});

test('should not minify SVG images when related options are disabled', t => {
  const stream = image({
    svgo : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.svg').size;
    const after  = file.contents.length;
    t.true(after < before);
  });

  stream.write(new gutil.File({
    path     : `${__dirname}/fixtures/test.svg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.svg`)
  }));
});

test('should skip unsupported images', t => {
  const stream = image();

  stream.on('data', file => {
    t.is(file.contents, null);
  });

  stream.write(new gutil.File({
    path : `${__dirname}fixtures/test.bmp`
  }));

  stream.end();
});
