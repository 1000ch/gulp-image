'use strict';

var path     = require('path');
var execFile = require('child_process').execFile;
var async    = require('async');

function Optimizer(param) {
  this.options = param.options;
  this.src = param.src;
  this.dest = param.dest || this.src;
  this.extension = path.extname(this.src);
  this.optimizers = this.getOptimizers(this.extension);
}

Optimizer.prototype.optipng = function() {
  var args = [];
  args.push('-i 1');
  args.push('-strip all');
  args.push('-fix');
  args.push('-o7');
  args.push('-force');
  args.push('-out');
  args.push(this.dest);
  args.push(this.src);

  return {
    name: 'optipng',
    path: require('optipng-bin'),
    args: args
  };
};

Optimizer.prototype.pngquant = function() {
  var args = [];
  args.push('--ext=.png');
  args.push('--speed=1');
  args.push('--force');
  args.push('256');
  args.push(this.dest);

  return {
    name: 'pngquant',
    path: require('pngquant-bin'),
    args: args
  };
};

Optimizer.prototype.advpng = function() {
  var args = [];
  args.push('--recompress');
  args.push('--shrink-extra');
  args.push(this.dest);

  return {
    name: 'advpng',
    path: require('advpng-bin'),
    args: args
  };
};

Optimizer.prototype.pngcrush = function() {
  var args = [];
  args.push('-rem alla');
  args.push('-rem text');
  args.push('-brute');
  args.push('-reduce');
  args.push(this.dest);

  return {
    name: 'pngcrush',
    path: require('pngcrush-bin'),
    args: args
  };
};

Optimizer.prototype.zopflipng = function() {
  var args = [];
  args.push('-m');
  args.push('--iterations=500');
  args.push('--splitting=3');
  args.push('--filters=01234mepb');
  args.push('--lossy_8bit');
  args.push('--lossy_transparent');
  args.push(this.dest);

  return {
    name: 'zopflipng',
    path: require('zopflipng-bin'),
    args: args
  };
};

Optimizer.prototype.gifsicle = function() {
  var args = [];
  args.push('--optimize');
  args.push('--output');
  args.push(this.dest);
  args.push(this.src);

  return {
    name: 'gifsicle',
    path: require('gifsicle'),
    args: args
  };
};

Optimizer.prototype.jpegtran = function() {
  var args = [];
  args.push('-optimize');
  args.push('-progressive');
  args.push('-outfile ' + this.dest);
  args.push(this.src);

  return {
    name: 'jpegtran',
    path: require('jpegtran-bin'),
    args: args
  };
};

Optimizer.prototype.jpegRecompress = function() {
  var args = [];
  args.push('--progressive');
  args.push('--strip');
  args.push('--quality medium');
  args.push('--min 40');
  args.push('--max 80');
  args.push(this.src);
  args.push(this.dest);

  return {
    name: 'jpeg-recompress',
    path: require('jpeg-recompress-bin'),
    args: args
  };
};

Optimizer.prototype.jpegoptim = function() {
  var args = [];
  args.push('--override');
  args.push('--strip-all');
  args.push('--strip-iptc');
  args.push('--strip-icc');
  args.push('--all-progressive');
  args.push(this.dest);

  return {
    name: 'jpegoptim',
    path: require('jpegoptim-bin'),
    args: args
  };
};

Optimizer.prototype.mozjpeg = function() {
  var args = [];
  args.push('-optimize');
  args.push('-progressive');
  args.push('-outfile ' + this.dest);
  args.push(this.src);

  return {
    name: 'mozjpeg',
    path: require('mozjpeg'),
    args: args
  };
};

Optimizer.prototype.svgo = function(options) {
  var args = [];
  if (options.enable) {
    args.push("--enable=" + options.enable);
  }
  if (options.disable) {
    args.push("--disable=" + options.disable);
  }

  args.push(this.src);
  args.push(this.dest);

  return {
    name: 'svgo',
    path: './node_modules/svgo/bin/svgo',
    args: args
  };
};

Optimizer.prototype.getOptimizers = function(extension) {
  var optimizers = [];
  extension = extension.toLowerCase();
  switch (extension) {
    case '.png':
      if (this.options.pngquant) {
        optimizers.push(this.pngquant());
      }
      if (this.options.optipng) {
        optimizers.push(this.optipng());
      }
      if (this.options.zopflipng) {
        optimizers.push(this.zopflipng());
      }
      if (this.options.advpng) {
        optimizers.push(this.advpng());
      }
      break;
    case '.jpg':
      if (this.options.jpegRecompress) {
        optimizers.push(this.jpegRecompress());
      }
      if (this.options.jpegoptim) {
        optimizers.push(this.jpegoptim());
      }
      if (this.options.mozjpeg) {
        optimizers.push(this.mozjpeg());
      }
      break;
    case '.gif':
      if (this.options.gifsicle) {
        optimizers.push(this.gifsicle());
      }
      break;
    case '.svg':
      if (this.options.svgo) {
        optimizers.push(this.svgo(this.options.svgo));
      }
      break;
  }
  return optimizers;
};

Optimizer.prototype.optimize = function(callback) {

  var fns = this.optimizers.map(function(optimizer) {
    return function(callback) {
      execFile(optimizer.path, optimizer.args, { cwd: path.resolve(__dirname) }, function() {
        callback(null, optimizer.name);
      });
    };
  });

  async.series(fns, function(error, result) {
    callback(error, {});
  });
};

module.exports = Optimizer;
