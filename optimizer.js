'use strict';

const path = require('path');
const execFile = require('child_process').execFile;

class Optimizer {
  constructor(params) {
    this.options = params.options;
    this.src = params.src;
    this.extension = path.extname(this.src).toLowerCase();
    this.optimizers = [];

    switch (this.extension) {
      case '.png':
        if (this.options.pngquant) {
          this.optimizers.push(this.pngquant());
        }
        if (this.options.optipng) {
          this.optimizers.push(this.optipng());
        }
        if (this.options.zopflipng) {
          this.optimizers.push(this.zopflipng());
        }
        if (this.options.advpng) {
          this.optimizers.push(this.advpng());
        }
        break;
      case '.jpg':
        if (this.options.jpegRecompress) {
          this.optimizers.push(this.jpegRecompress());
        }
        if (this.options.jpegoptim) {
          this.optimizers.push(this.jpegoptim());
        }
        if (this.options.mozjpeg) {
          this.optimizers.push(this.mozjpeg());
        }
        break;
      case '.gif':
        if (this.options.gifsicle) {
          this.optimizers.push(this.gifsicle());
        }
        break;
      case '.svg':
        if (this.options.svgo) {
          this.optimizers.push(this.svgo(this.options.svgo));
        }
        break;
    }
  }

  optipng() {
    let args = [];
    args.push('-i 1');
    args.push('-strip all');
    args.push('-fix');
    args.push('-o7');
    args.push('-force');
    args.push('-out');
    args.push(this.src);
    args.push(this.src);

    return {
      name : 'optipng',
      path : require('optipng-bin'),
      args : args
    };
  }

  pngquant() {
    let args = [];
    args.push('--ext=.png');
    args.push('--speed=1');
    args.push('--force');
    args.push('256');
    args.push(this.src);

    return {
      name : 'pngquant',
      path : require('pngquant-bin'),
      args : args
    };
  }

  advpng() {
    let args = [];
    args.push('--recompress');
    args.push('--shrink-extra');
    args.push(this.src);

    return {
      name : 'advpng',
      path : require('advpng-bin'),
      args : args
    };
  }

  pngcrush() {
    let args = [];
    args.push('-rem alla');
    args.push('-rem text');
    args.push('-brute');
    args.push('-reduce');
    args.push(this.src);

    return {
      name : 'pngcrush',
      path : require('pngcrush-bin'),
      args : args
    };
  }

  zopflipng() {
    let args = [];
    args.push('-m');
    args.push('--iterations=500');
    args.push('--splitting=3');
    args.push('--filters=01234mepb');
    args.push('--lossy_8bit');
    args.push('--lossy_transparent');
    args.push(this.src);

    return {
      name : 'zopflipng',
      path : require('zopflipng-bin'),
      args : args
    };
  }

  gifsicle() {
    let args = [];
    args.push('--optimize');
    args.push('--output');
    args.push(this.src);
    args.push(this.src);

    return {
      name : 'gifsicle',
      path : require('gifsicle'),
      args : args
    };
  }

  jpegtran() {
    let args = [];
    args.push('-optimize');
    args.push('-progressive');
    args.push(`-outfile ${this.src}`);
    args.push(this.src);

    return {
      name : 'jpegtran',
      path : require('jpegtran-bin'),
      args : args
    };
  }

  jpegRecompress() {
    let args = [];
    args.push('--progressive');
    args.push('--strip');
    args.push('--quality medium');
    args.push('--min 40');
    args.push('--max 80');
    args.push(this.src);
    args.push(this.src);

    return {
      name : 'jpeg-recompress',
      path : require('jpeg-recompress-bin'),
      args : args
    };
  }

  jpegoptim() {
    let args = [];
    args.push('--override');
    args.push('--strip-all');
    args.push('--strip-iptc');
    args.push('--strip-icc');
    args.push('--all-progressive');
    args.push(this.src);

    return {
      name : 'jpegoptim',
      path : require('jpegoptim-bin'),
      args : args
    };
  }

  mozjpeg() {
    let args = [];
    args.push('-optimize');
    args.push('-progressive');
    args.push(this.src);

    return {
      name : 'mozjpeg',
      path : require('mozjpeg'),
      args : args
    };
  }

  svgo(options) {
    let args = [];
    if (options.enable) {
      args.push(`--enable=${options.enable}`);
    }
    if (options.disable) {
      args.push(`--disable=${options.disable}`);
    }
    args.push(this.src);
    args.push(this.src);

    return {
      name : 'svgo',
      path : './node_modules/svgo/bin/svgo',
      args : args
    };
  }

  optimize() {
    let cwd = path.resolve(__dirname);
    let promises = this.optimizers.map(optimizer => {
      return new Promise((resolve, reject) => {
        execFile(optimizer.path, optimizer.args, { cwd }, error => {
          if (error) {
            reject(error);
          } else {
            resolve(optimizer.name);
          }
        });
      });
    });

    return Promise.all(promises);
  }
}

module.exports = Optimizer;
