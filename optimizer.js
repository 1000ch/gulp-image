'use strict';

const path = require('path');
const execa = require('execa');
const execBuffer = require('exec-buffer');

class Optimizer {
  constructor(params) {
    this.options = params.options;
    this.src = params.src;
    this.buffer = params.buffer;
  }

  optipng(buffer) {
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

  pngquant(buffer) {
    return execBuffer({
      input : buffer,
      bin   : require('pngquant-bin'),
      args  : [
        '--speed=1',
        '--force',
        '256',
        '--output',
        execBuffer.output,
        execBuffer.input
      ]
    });
  }

  advpng(buffer) {
    return execBuffer({
      input : buffer,
      bin   : require('advpng-bin'),
      args  : [
        '--recompress',
        '--shrink-extra',
        execBuffer.input,
        execBuffer.output
      ]
    });
  }

  pngcrush(buffer) {
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

  zopflipng(buffer) {
    return execBuffer({
      input : buffer,
      bin   : require('zopflipng-bin'),
      args  : [
        '-y',
        '-m',
        '--iterations=500',
        '--filters=01234mepb',
        '--lossy_8bit',
        '--lossy_transparent',
        execBuffer.input,
        execBuffer.output
      ]
    });
  }

  gifsicle(buffer) {
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

  jpegtran(buffer) {
    return execBuffer({
      input : buffer,
      bin   : require('jpegtran-bin'),
      args  : [
        '-optimize',
        '-progressive',
        '-outfile',
        execBuffer.output,
        execBuffer.input
      ]
    });
  }

  jpegRecompress(buffer) {
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

  jpegoptim(buffer) {
    return execa(require('jpegoptim-bin'), [
      '--strip-all',
      '--strip-iptc',
      '--strip-icc',
      '--stdin',
		  '--stdout'
    ], {
      input : buffer
    });
  }

  mozjpeg(buffer) {
    return execBuffer({
      input : buffer,
      bin   : require('mozjpeg'),
      args  : [
        '-optimize',
        '-progressive',
        '-outfile',
        execBuffer.output,
        execBuffer.input
      ]
    });
  }

  svgo(buffer, options) {
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
      bin   : `${__dirname}/node_modules/svgo/bin/svgo`,
      args  : args
    });
  }

  optimize() {
    let promises = [];
    let extension = path.extname(this.src).toLowerCase();

    if (extension === '.jpeg' || extension === '.jpg') {
      return Promise.resolve(this.buffer)
        .then(buffer => this.options.jpegRecompress ? this.jpegRecompress(buffer) : buffer)
        .then(buffer => this.options.jpegoptim ? this.jpegoptim(buffer) : buffer)
        .then(buffer => this.options.mozjpeg ? this.mozjpeg(buffer) : buffer)
        .catch(error => console.error(error));
    } else if (extension === '.png') {
      return Promise.resolve(this.buffer)
        .then(buffer => this.options.pngquant ? this.pngquant(buffer) : buffer)
        .then(buffer => this.options.optipng ? this.optipng(buffer) : buffer)
        .then(buffer => this.options.zopflipng ? this.zopflipng(buffer) : buffer)
        .then(buffer => this.options.advpng ? this.advpng(buffer) : buffer)
        .catch(error => console.error(error));
    } else if (extension === '.gif') {
      return Promise.resolve(this.buffer)
        .then(buffer => this.options.gifsicle ? this.gifsicle(buffer) : buffer)
        .catch(error => console.error(error));
    } else if (extension === '.svg') {
      return Promise.resolve(this.buffer)
        .then(buffer => this.options.svgo ? this.svgo(buffer, this.options.svgo) : buffer)
        .catch(error => console.error(error));
    } else {
      return Promise.resolve(this.buffer);
    }
  }
}

module.exports = Optimizer;
