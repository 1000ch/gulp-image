import fs from 'node:fs';
import test from 'ava';
import Vinyl from 'vinyl';
import pEvent from 'p-event';
import image from '../index.js';

const testGif = new URL('./fixtures/test.gif', import.meta.url).pathname;
const testJpg = new URL('./fixtures/test.jpg', import.meta.url).pathname;
const testPng = new URL('./fixtures/test.png', import.meta.url).pathname;
const testSvg = new URL('./fixtures/test.svg', import.meta.url).pathname;
const testBmp = new URL('./fixtures/test.bmp', import.meta.url).pathname;

test('should minify PNG images with pngquant', async t => {
  const stream = image({
    pngquant: true,
    optipng: false,
    zopflipng: false,
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.end(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng),
  }));

  await pEvent(stream, 'end');
});

test('should minify PNG images with optipng', async t => {
  const stream = image({
    pngquant: false,
    optipng: true,
    zopflipng: false,
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.end(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng),
  }));

  await pEvent(stream, 'end');
});

test('should minify PNG images with zopflipng', async t => {
  const stream = image({
    pngquant: false,
    optipng: false,
    zopflipng: true,
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.end(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng),
  }));

  await pEvent(stream, 'end');
});

test('should not minify PNG images when related options are disabled', async t => {
  const stream = image({
    pngquant: false,
    optipng: false,
    zopflipng: false,
  });

  stream.on('data', file => {
    const before = fs.statSync(testPng).size;
    const after = file.contents.length;
    t.true(after === before);
  });

  stream.end(new Vinyl({
    path: testPng,
    contents: fs.readFileSync(testPng),
  }));

  await pEvent(stream, 'end');
});

test('should minify JPG images with jpegRecompress', async t => {
  const stream = image({
    jpegRecompress: true,
    mozjpeg: false,
  });

  stream.on('data', file => {
    const before = fs.statSync(testJpg).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.end(new Vinyl({
    path: testJpg,
    contents: fs.readFileSync(testJpg),
  }));

  await pEvent(stream, 'end');
});

test('should minify JPG images with mozjpeg', async t => {
  const stream = image({
    jpegRecompress: false,
    mozjpeg: true,
  });

  stream.on('data', file => {
    const before = fs.statSync(testJpg).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.end(new Vinyl({
    path: testJpg,
    contents: fs.readFileSync(testJpg),
  }));

  await pEvent(stream, 'end');
});

test('should not minify JPG images when related options are disabled', async t => {
  const stream = image({
    jpegRecompress: false,
    mozjpeg: false,
  });

  stream.on('data', file => {
    const before = fs.statSync(testJpg).size;
    const after = file.contents.length;
    t.true(after === before);
  });

  stream.end(new Vinyl({
    path: testJpg,
    contents: fs.readFileSync(testJpg),
  }));

  await pEvent(stream, 'end');
});

test('should minify GIF images', async t => {
  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync(testGif).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.end(new Vinyl({
    path: testGif,
    contents: fs.readFileSync(testGif),
  }));

  await pEvent(stream, 'end');
});

test('should not minify GIF images when related options are disabled', async t => {
  const stream = image({
    gifsicle: false,
  });

  stream.on('data', file => {
    const before = fs.statSync(testGif).size;
    const after = file.contents.length;
    t.true(after === before);
  });

  stream.end(new Vinyl({
    path: testGif,
    contents: fs.readFileSync(testGif),
  }));

  await pEvent(stream, 'end');
});

test('should minify SVG images', async t => {
  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync(testSvg).size;
    const after = file.contents.length;
    t.true(after < before);
  });

  stream.end(new Vinyl({
    path: testSvg,
    contents: fs.readFileSync(testSvg),
  }));

  await pEvent(stream, 'end');
});

test('should not minify SVG images when related options are disabled', async t => {
  const stream = image({
    svgo: false,
  });

  stream.on('data', file => {
    const before = fs.statSync(testSvg).size;
    const after = file.contents.length;
    t.true(after === before);
  });

  stream.end(new Vinyl({
    path: testSvg,
    contents: fs.readFileSync(testSvg),
  }));

  await pEvent(stream, 'end');
});

test('should skip unsupported images', async t => {
  const stream = image();

  stream.on('data', file => {
    t.is(file.contents, null);
  });

  stream.end(new Vinyl({
    path: testBmp,
  }));

  await pEvent(stream, 'end');
});
