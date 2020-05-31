'use strict';

const path = require('path');
const execBuffer = require('exec-buffer');
const isPng = require('is-png');
const isJpg = require('is-jpg');
const isGif = require('is-gif');
const isSvg = require('is-svg');

function optipng(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['-i 1', '-strip all', '-fix', '-o7', '-force'];

  return execBuffer({
    input: buffer,
    bin: require('optipng-bin'),
    args: [...parameters, '-out', execBuffer.output, execBuffer.input]
  });
}

function pngquant(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['--speed=1', '--force', 256];

  return execBuffer({
    input: buffer,
    bin: require('pngquant-bin'),
    args: [...parameters, '--output', execBuffer.output, execBuffer.input]
  });
}

function zopflipng(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['-y', '--lossy_8bit', '--lossy_transparent'];

  return execBuffer({
    input: buffer,
    bin: require('zopflipng-bin'),
    args: [...parameters, execBuffer.input, execBuffer.output]
  });
}

function jpegRecompress(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['--strip', '--quality', 'medium', '--min', 40, '--max', 80];

  return execBuffer({
    input: buffer,
    bin: require('jpeg-recompress-bin'),
    args: [...parameters, execBuffer.input, execBuffer.output]
  });
}

function mozjpeg(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['-optimize', '-progressive'];

  return execBuffer({
    input: buffer,
    bin: require('mozjpeg'),
    args: [...parameters, '-outfile', execBuffer.output, execBuffer.input]
  });
}

function gifsicle(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['--optimize'];

  return execBuffer({
    input: buffer,
    bin: require('gifsicle'),
    args: [...parameters, '--output', execBuffer.output, execBuffer.input]
  });
}

function svgo(buffer, args) {
  const parameters = Array.isArray(args) ? args : [];

  return execBuffer({
    input: buffer,
    bin: path.join(path.dirname(require.resolve('exec-buffer')), '../svgo/bin/svgo'),
    args: [...parameters, '--input', execBuffer.input, '--output', execBuffer.output]
  });
}

module.exports = async (buffer, options) => {
  if (isJpg(buffer)) {
    if (options.jpegRecompress) {
      buffer = await jpegRecompress(buffer, options.jpegRecompress);
    }

    if (options.mozjpeg) {
      buffer = await mozjpeg(buffer, options.mozjpeg);
    }
  } else if (isPng(buffer)) {
    if (options.pngquant) {
      buffer = await pngquant(buffer, options.pngquant);
    }

    if (options.optipng) {
      buffer = await optipng(buffer, options.optipng);
    }

    if (options.zopflipng) {
      buffer = await zopflipng(buffer, options.zopflipng);
    }
  } else if (isGif(buffer)) {
    if (options.gifsicle) {
      buffer = await gifsicle(buffer, options.gifsicle);
    }
  } else if (isSvg(buffer)) {
    if (options.svgo) {
      buffer = await svgo(buffer, options.svgo);
    }
  }

  return buffer;
};
