"use strict";

var fs = require('fs');
var path = require('path');

var spawn = require('child_process').spawn;
var execFile = require('child_process').execFile;
var async = require('async');

function Optimizer(param) {
  this.options = param.options;
  if (this.options.optipng === undefined) {
    this.options.optipng = true;
  }
  if (this.options.pngquant === undefined) {
    this.options.pngquant = true;
  }
  if (this.options.zopflipng === undefined) {
    this.options.zopflipng = true;
  }
  if (this.options.pngcrush === undefined) {
    this.options.pngcrush = true;
  }
  if (this.options.advpng === undefined) {
    this.options.advpng = true;
  }
  if (this.options.pngout === undefined) {
    this.options.pngout = true;
  }
  if (this.options.jpegtran === undefined) {
    this.options.jpegtran = true;
  }
  if (this.options.jpegRecompress === undefined) {
    this.options.jpegRecompress = true;
  }
  if (this.options.gifsicle === undefined) {
    this.options.gifsicle = true;
  }

  this.src = param.src;
  this.dest = param.dest || this.src;
  this.extension = path.extname(this.src);
  this.optimizers = this.getOptimizers(this.extension);
}

Optimizer.prototype.optipng = function () {
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
    path: require('optipng-bin').path,
    args: args
  };
};

Optimizer.prototype.pngquant = function () {
  var args = [];
  args.push('--ext=.png');
  args.push('--speed=1');
  args.push('--force');
  args.push('256');
  args.push(this.dest);

  return {
    name: 'pngquant',
    path: require('pngquant-bin').path,
    args: args
  };
};

Optimizer.prototype.advpng = function () {
  var args = [];
  args.push('--recompress');
  args.push('--shrink-extra');
  args.push(this.dest);

  return {
    name: 'advpng',
    path: require('advpng-bin').path,
    args: args
  };
};

Optimizer.prototype.pngcrush = function () {
  var args = [];
  args.push('-rem alla');
  args.push('-rem text');
  args.push('-brute');
  args.push('-reduce');
  args.push(this.dest);

  return {
    name: 'pngcrush',
    path: require('pngcrush-bin').path,
    args: args
  };
};

Optimizer.prototype.pngout = function () {
  var args = [];
  args.push('-s0');
  args.push('-k0');
  args.push('-f0');
  args.push(this.dest);
  args.push(this.dest);

  return {
    name: 'pngout',
    path: require('pngout-bin').path,
    args: args
  };
};

Optimizer.prototype.zopflipng = function () {
  var args = [];
  args.push('-m');
  args.push('--iterations=500');
  args.push('--splitting=3');
  args.push('--filters=01234mepb');
  args.push('--lossy_8bit');
  args.push('--lossy_transparent');
  //args.push(this.src);
  args.push(this.dest);

  return {
    name: 'zopflipng',
    path: require('zopflipng-bin').path,
    args: args
  };
};

Optimizer.prototype.gifsicle = function () {
  var args = [];
  args.push('--optimize');
  args.push('--output');
  args.push(this.dest);
  args.push(this.src);

  return {
    name: 'gifsicle',
    path: require('gifsicle').path,
    args: args
  };
};

Optimizer.prototype.jpegtran = function () {
  var args = [];
  args.push('-optimize');
  args.push('-progressive');
  args.push('-outfile');
  args.push(this.dest);
  args.push(this.src);

  return {
    name: 'jpegtran',
    path: require('jpegtran-bin').path,
    args: args
  };
};

Optimizer.prototype.jpegRecompress = function () {
  var args = [];
  args.push('--progressive');
  args.push('--strip');
  args.push(this.dest);
  args.push(this.dest);

  return {
    name: 'jpeg-recompress',
    path: require('jpeg-recompress-bin').path,
    args: args
  };
};

Optimizer.prototype.getOptimizers = function (extension) {
  var optimizers = [];
  extension = extension.toLowerCase();
  switch (extension) {
    case '.png':
      if (this.options.optipng) {
        optimizers.push(this.optipng());
      }
      if (this.options.pngquant) {
        optimizers.push(this.pngquant());
      }
      if (this.options.zopflipng) {
        optimizers.push(this.zopflipng());
      }
      if (this.options.pngcrush) {
        optimizers.push(this.pngcrush());
      }
      if (this.options.advpng) {
        optimizers.push(this.advpng());
      }
      if (this.options.pngout) {
        optimizers.push(this.pngout());
      }
      break;
    case '.jpg':
      if (this.options.jpegtran) {
        optimizers.push(this.jpegtran());
      }
      if (this.options.jpegRecompress) {
        optimizers.push(this.jpegRecompress());
      }
      break;
    case '.gif':
      if (this.options.gifsicle) {
        optimizers.push(this.gifsicle());
      }
      break;
  }
  return optimizers;
};

Optimizer.prototype.optimize = function (callback) {

  var src = this.src;
  var dest = this.dest;

  var fns = this.optimizers.map(function (optimizer) {
    return function (callback) {
      execFile(optimizer.path, optimizer.args, function () {
        callback(null, optimizer.name);
      });
    };
  });

  async.series(fns, function (error, result) {
    callback(error, {});
  });
};

module.exports = Optimizer;
