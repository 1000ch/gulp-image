import fs from 'fs';
import test from 'ava';
import Vinyl from 'vinyl';
import image from '../index.js';

const testGif = new URL('./fixtures/test.gif', import.meta.url).pathname;
const testJpg = new URL('./fixtures/test.jpg', import.meta.url).pathname;
const testPng = new URL('./fixtures/test.png', import.meta.url).pathname;
const testSvg = new URL('./fixtures/test.svg', import.meta.url).pathname;
const testBmp = new URL('./fixtures/test.bmp', import.meta.url).pathname;

test.cb('should minify PNG images with pngquant', t => {
  const stream = image({
    pngquant: true,
    optipng: false,
    zopflipng: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng)
  }));
});

test.cb('should minify PNG images with optipng', t => {
  const stream = image({
    pngquant: false,
    optipng: true,
    zopflipng: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng)
  }));
});

test.cb('should minify PNG images with zopflipng', t => {
  const stream = image({
    pngquant: false,
    optipng: false,
    zopflipng: true
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng)
  }));
});

test.cb('should not minify PNG images when related options are disabled', t => {
  const stream = image({
    pngquant: false,
    optipng: false,
    zopflipng: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after === before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng)
  }));
});

test.cb('should minify JPG images with jpegRecompress', t => {
  const stream = image({
    jpegRecompress: true,
    mozjpeg: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testJpg).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testJpg,
    contents: fs.readFileSync(testJpg)
  }));
});

test.cb('should minify JPG images with mozjpeg', t => {
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

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testJpg,
    contents: fs.readFileSync(testJpg)
  }));
});

test.cb('should not minify JPG images when related options are disabled', t => {
  const stream = image({
    jpegRecompress: false,
    mozjpeg: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testJpg).size;
    const after = file.contents.length;
    t.true(after === before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testJpg,
    contents: fs.readFileSync(testJpg)
  }));
});

test.cb('should minify GIF images', t => {
  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync(testGif).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testGif,
    contents: fs.readFileSync(testGif)
  }));
});

test.cb('should not minify GIF images when related options are disabled', t => {
  const stream = image({
    gifsicle: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testGif).size;
    const after = file.contents.length;
    t.true(after === before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testGif,
    contents: fs.readFileSync(testGif)
  }));
});

test.cb('should minify SVG images', t => {
  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync(testSvg).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testSvg,
    contents: fs.readFileSync(testSvg)
  }));
});

test.cb('should not minify SVG images when related options are disabled', t => {
  const stream = image({
    svgo: false
  });

  stream.on('data', file => {
    const before = fs.statSync(testSvg).size;
    const after = file.contents.length;
    t.true(after === before);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testSvg,
    contents: fs.readFileSync(testSvg)
  }));
});

test.cb('should skip unsupported images', t => {
  const stream = image();

  stream.on('data', file => {
    t.is(file.contents, null);
  });

  stream.on('end', () => t.end());

  stream.end(new Vinyl({
    path: testBmp
  }));
});
