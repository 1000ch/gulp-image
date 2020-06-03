'use strict';
const fs = require('fs');
const path = require('path');
const test = require('ava');
const Vinyl = require('vinyl');
const image = require('..');

const testGif = path.resolve(__dirname, './fixtures/test.gif');
const testJpg = path.resolve(__dirname, './fixtures/test.jpg');
const testPng = path.resolve(__dirname, './fixtures/test.png');
const testSvg = path.resolve(__dirname, './fixtures/test.svg');
const testBmp = path.resolve(__dirname, './fixtures/test.bmp');

test.cb('should minify PNG images with pngquant', t => {
  t.plan(1);

  const stream = image({
    pngquant: true,
    optipng: false,
    zopflipng: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng)
  }));

  stream.end();
});

test.cb('should minify PNG images with optipng', t => {
  t.plan(1);

  const stream = image({
    pngquant: false,
    optipng: true,
    zopflipng: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng)
  }));

  stream.end();
});

test.cb('should minify PNG images with zopflipng', t => {
  t.plan(1);

  const stream = image({
    pngquant: false,
    optipng: false,
    zopflipng: true
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng)
  }));

  stream.end();
});

test.cb('should not minify PNG images when related options are disabled', t => {
  t.plan(1);

  const stream = image({
    pngquant: false,
    optipng: false,
    zopflipng: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after === before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng)
  }));

  stream.end();
});

test.cb('should minify JPG images with jpegRecompress', t => {
  t.plan(1);

  const stream = image({
    jpegRecompress: true,
    mozjpeg: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testJpg).size;
    const after = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testJpg,
    contents: fs.readFileSync(testJpg)
  }));

  stream.end();
});

test.cb('should minify JPG images with mozjpeg', t => {
  t.plan(1);

  const stream = image({
    jpegRecompress: false,
    mozjpeg: true
  });

  stream.on('data', file => {
    const before = fs.statSync(testJpg).size;
    const after = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testJpg,
    contents: fs.readFileSync(testJpg)
  }));

  stream.end();
});

test.cb('should not minify JPG images when related options are disabled', t => {
  t.plan(1);

  const stream = image({
    jpegRecompress: false,
    mozjpeg: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testJpg).size;
    const after = file.contents.length;
    t.true(after === before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testJpg,
    contents: fs.readFileSync(testJpg)
  }));

  stream.end();
});

test.cb('should minify GIF images', t => {
  t.plan(1);

  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync(testGif).size;
    const after = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testGif,
    contents: fs.readFileSync(testGif)
  }));

  stream.end();
});

test.cb('should not minify GIF images when related options are disabled', t => {
  t.plan(1);

  const stream = image({
    gifsicle: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testGif).size;
    const after = file.contents.length;
    t.true(after === before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testGif,
    contents: fs.readFileSync(testGif)
  }));

  stream.end();
});

test.cb('should minify SVG images', t => {
  t.plan(1);

  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync(testSvg).size;
    const after = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testSvg,
    contents: fs.readFileSync(testSvg)
  }));
});

test.cb('should not minify SVG images when related options are disabled', t => {
  t.plan(1);

  const stream = image({
    svgo: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testSvg).size;
    const after = file.contents.length;
    t.true(after === before);
    t.end();
  });

  stream.write(new Vinyl({
    path: testSvg,
    contents: fs.readFileSync(testSvg)
  }));
});

test.cb('should skip unsupported images', t => {
  t.plan(1);

  const stream = image();

  stream.on('data', file => {
    t.is(file.contents, null);
    t.end();
  });

  stream.write(new Vinyl({
    path: testBmp
  }));

  stream.end();
});
