'use strict';

const path = require('path');
const execa = require('execa');
const execBuffer = require('exec-buffer');
const isPng = require('is-png');
const isJpg = require('is-jpg');
const isGif = require('is-gif');
const isSvg = require('is-svg');

function optipng(buffer) {
  return execBuffer({
    input : buffer,
    bin   : require('optipng-bin'),
    args  : [
      '-i 1',
      '-strip all',
      '-fix',
      '-o7',
      '-force',
      '-out', execBuffer.output,
      execBuffer.input
    ]
  });
}

function pngquant(buffer) {
  return execa.stdout(require('pngquant-bin'), [
    '--speed=1',
    '--force',
    '256'
  ], {
    encoding : null,
    input    : buffer
  });
}

function pngcrush(buffer) {
  return execBuffer({
    input : buffer,
    bin   : require('pngcrush-bin'),
    args  : [
      '-rem alla',
      '-rem text',
      '-brute',
      '-reduce',
      execBuffer.input,
      execBuffer.output
    ]
  });
}

function zopflipng(buffer) {
  return execBuffer({
    input : buffer,
    bin   : require('zopflipng-bin'),
    args  : [
      '-y',
      '--lossy_8bit',
      '--lossy_transparent',
      execBuffer.input,
      execBuffer.output
    ]
  });
}

function gifsicle(buffer) {
  return execBuffer({
    input : buffer,
    bin   : require('gifsicle'),
    args  : [
      '--optimize',
      '--output',
      execBuffer.output,
      execBuffer.input
    ]
  });
}

function jpegRecompress(buffer) {
  return execBuffer({
    input : buffer,
    bin   : require('jpeg-recompress-bin'),
    args  : [
      '--strip',
      '--quality', 'medium',
      '--min', 40,
      '--max', 80,
      execBuffer.input,
      execBuffer.output
    ]
  });
}

function jpegoptim(buffer) {
  return execa.stdout(require('jpegoptim-bin'), [
    '--strip-all',
    '--strip-iptc',
    '--strip-icc',
    '--stdin',
	  '--stdout'
  ], {
    encoding : null,
    input    : buffer
  });
}

function mozjpeg(buffer) {
  return execa.stdout(require('mozjpeg'), [
    '-optimize',
    '-progressive'
  ], {
    encoding : null,
    input    : buffer
  });
}

function svgo(buffer, options) {
  let args = [
    '--input', execBuffer.input,
    '--output', execBuffer.output
  ];

  if (options.enable) {
    args.push(`--enable=${options.enable}`);
  }

  if (options.disable) {
    args.push(`--disable=${options.disable}`);
  }

  return execBuffer({
    input : buffer,
    bin   : path.join(path.dirname(require.resolve('exec-buffer')), '../svgo/bin/svgo'),
    args  : args
  });
}

module.exports = function(buffer, options) {
  if (isJpg(buffer)) {
    return Promise.resolve(buffer)
      .then(buffer => options.jpegRecompress ? jpegRecompress(buffer) : buffer)
      .then(buffer => options.jpegoptim ? jpegoptim(buffer) : buffer)
      .then(buffer => options.mozjpeg ? mozjpeg(buffer) : buffer);
  } else if (isPng(buffer)) {
    return Promise.resolve(buffer)
      .then(buffer => options.pngquant ? pngquant(buffer) : buffer)
      .then(buffer => options.optipng ? optipng(buffer) : buffer)
      .then(buffer => options.zopflipng ? zopflipng(buffer) : buffer);
  } else if (isGif(buffer)) {
    return Promise.resolve(buffer)
      .then(buffer => options.gifsicle ? gifsicle(buffer) : buffer);
  } else if (isSvg(buffer)) {
    return Promise.resolve(buffer)
      .then(buffer => options.svgo ? svgo(buffer, options.svgo) : buffer);
  }

  return Promise.resolve(buffer);
};
