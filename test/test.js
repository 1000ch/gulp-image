import fs, {promises as fsp} from 'node:fs';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import Vinyl from 'vinyl';
import {pEvent} from 'p-event';
import image from '../index.js';

const testGif = new URL('./fixtures/test.gif', import.meta.url);
const testJpg = new URL('./fixtures/test.jpg', import.meta.url);
const testPng = new URL('./fixtures/test.png', import.meta.url);
const testSvg = new URL('./fixtures/test.svg', import.meta.url);
const testBmp = new URL('./fixtures/test.bmp', import.meta.url);

const testGifSize = fs.statSync(testGif).size;
const testJpgSize = fs.statSync(testJpg).size;
const testPngSize = fs.statSync(testPng).size;
const testSvgSize = fs.statSync(testSvg).size;

test('should minify PNG images with pngquant', async t => {
  const stream = image({
    pngquant: true,
    optipng: false,
    zopflipng: false,
  });

  stream.on('data', file => {
    t.true(file.contents.length < testGifSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testPng),
    contents: await fsp.readFile(testPng),
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
    t.true(file.contents.length < testPngSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testPng),
    contents: await fsp.readFile(testPng),
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
    t.true(file.contents.length < testPngSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testPng),
    contents: await fsp.readFile(testPng),
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
    t.true(file.contents.length === testPngSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testPng),
    contents: await fsp.readFile(testPng),
  }));

  await pEvent(stream, 'end');
});

test('should minify JPG images with jpegRecompress', async t => {
  const stream = image({
    jpegRecompress: true,
    mozjpeg: false,
  });

  stream.on('data', file => {
    t.true(file.contents.length < testJpgSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testJpg),
    contents: await fsp.readFile(testJpg),
  }));

  await pEvent(stream, 'end');
});

test('should minify JPG images with mozjpeg', async t => {
  const stream = image({
    jpegRecompress: false,
    mozjpeg: true,
  });

  stream.on('data', file => {
    t.true(file.contents.length < testJpgSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testJpg),
    contents: await fsp.readFile(testJpg),
  }));

  await pEvent(stream, 'end');
});

test('should not minify JPG images when related options are disabled', async t => {
  const stream = image({
    jpegRecompress: false,
    mozjpeg: false,
  });

  stream.on('data', file => {
    t.true(file.contents.length === testJpgSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testJpg),
    contents: await fsp.readFile(testJpg),
  }));

  await pEvent(stream, 'end');
});

test('should minify GIF images', async t => {
  const stream = image();

  stream.on('data', file => {
    t.true(file.contents.length < testGifSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testGif),
    contents: await fsp.readFile(testGif),
  }));

  await pEvent(stream, 'end');
});

test('should not minify GIF images when related options are disabled', async t => {
  const stream = image({
    gifsicle: false,
  });

  stream.on('data', file => {
    t.true(file.contents.length === testGifSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testGif),
    contents: await fsp.readFile(testGif),
  }));

  await pEvent(stream, 'end');
});

test('should minify SVG images', async t => {
  const stream = image();

  stream.on('data', file => {
    t.true(file.contents.length < testSvgSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testSvg),
    contents: await fsp.readFile(testSvg),
  }));

  await pEvent(stream, 'end');
});

test('should not minify SVG images when related options are disabled', async t => {
  const stream = image({
    svgo: false,
  });

  stream.on('data', file => {
    t.true(file.contents.length === testSvgSize);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testSvg),
    contents: await fsp.readFile(testSvg),
  }));

  await pEvent(stream, 'end');
});

test('should skip unsupported images', async t => {
  const stream = image();

  stream.on('data', file => {
    t.is(file.contents, null);
  });

  stream.end(new Vinyl({
    path: fileURLToPath(testBmp),
  }));

  await pEvent(stream, 'end');
});
