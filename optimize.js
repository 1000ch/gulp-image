'use strict';

const path = require('path');
const execBuffer = require('exec-buffer');
const isPng = require('is-png');
const isJpg = require('is-jpg');
const isGif = require('is-gif');
const isSvg = require('is-svg');

function optipng(buffer, args) {
  const params = Array.isArray(args) ? args : ['-i 1', '-strip all', '-fix', '-o7', '-force'];

  return execBuffer({
    input : buffer,
    bin   : require('optipng-bin'),
    args  : [...params, '-out', execBuffer.output, execBuffer.input]
  });
}

function pngquant(buffer, args) {
  const params = Array.isArray(args) ? args : ['--speed=1', '--force', 256];

  return execBuffer({
    input : buffer,
    bin   : require('pngquant-bin'),
    args  : [...params, '--output', execBuffer.output, execBuffer.input]
  });
}

function zopflipng(buffer, args) {
  const params = Array.isArray(args) ? args : ['-y', '--lossy_8bit', '--lossy_transparent'];

  return execBuffer({
    input : buffer,
    bin   : require('zopflipng-bin'),
    args  : [...params, execBuffer.input, execBuffer.output]
  });
}

function jpegRecompress(buffer, args) {
  const params = Array.isArray(args) ? args : ['--strip', '--quality', 'medium', '--min', 40, '--max', 80];

  return execBuffer({
    input : buffer,
    bin   : require('jpeg-recompress-bin'),
    args  : [...params, execBuffer.input, execBuffer.output]
  });
}

function mozjpeg(buffer, args) {
  const params = Array.isArray(args) ? args : ['-optimize', '-progressive'];

  return execBuffer({
    input : buffer,
    bin   : require('mozjpeg'),
    args  : [...params, '-outfile', execBuffer.output, execBuffer.input]
  });
}

function gifsicle(buffer, args) {
  const params = Array.isArray(args) ? args : ['--optimize'];

  return execBuffer({
    input : buffer,
    bin   : require('gifsicle'),
    args  : [...params, '--output', execBuffer.output, execBuffer.input]
  });
}

function svgo(buffer, args) {
  const params = Array.isArray(args) ? args : [];

  return execBuffer({
    input : buffer,
    bin   : path.join(path.dirname(require.resolve('exec-buffer')), '../svgo/bin/svgo'),
    args  : [...params, '--input', execBuffer.input, '--output', execBuffer.output]
  });
}

module.exports = function(buffer, options) {
  if (isJpg(buffer)) {
    return Promise.resolve(buffer)
      .then(buffer => options.jpegRecompress ? jpegRecompress(buffer, options.jpegRecompress) : buffer)
      .then(buffer => options.mozjpeg ? mozjpeg(buffer, options.mozjpeg) : buffer);
  } else if (isPng(buffer)) {
    return Promise.resolve(buffer)
      .then(buffer => options.pngquant ? pngquant(buffer, options.pngquant) : buffer)
      .then(buffer => options.optipng ? optipng(buffer, options.optipng) : buffer)
      .then(buffer => options.zopflipng ? zopflipng(buffer, options.zopflipng) : buffer);
  } else if (isGif(buffer)) {
    return Promise.resolve(buffer)
      .then(buffer => options.gifsicle ? gifsicle(buffer, options.gifsicle) : buffer);
  } else if (isSvg(buffer)) {
    return Promise.resolve(buffer)
      .then(buffer => options.svgo ? svgo(buffer, options.svgo) : buffer);
  }

  return Promise.resolve(buffer);
};
