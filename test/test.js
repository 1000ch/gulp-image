'use strict';

const test = require('ava');
const fs = require('fs');
const Vinyl = require('vinyl');
const image = require('..');

test.cb('should minify PNG images with pngquant', t => {
  t.plan(1);

  const stream = image({
    pngquant  : true,
    optipng   : false,
    zopflipng : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.png').size;
    const after  = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.png`)
  }));

  stream.end();
});

test.cb('should minify PNG images with optipng', t => {
  t.plan(1);

  const stream = image({
    pngquant  : false,
    optipng   : true,
    zopflipng : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.png').size;
    const after  = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.png`)
  }));

  stream.end();
});

test.cb('should minify PNG images with zopflipng', t => {
  t.plan(1);

  const stream = image({
    pngquant  : false,
    optipng   : false,
    zopflipng : true
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.png').size;
    const after  = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.png`)
  }));

  stream.end();
});

test.cb('should not minify PNG images when related options are disabled', t => {
  t.plan(1);

  const stream = image({
    pngquant  : false,
    optipng   : false,
    zopflipng : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.png').size;
    const after  = file.contents.length;
    t.true(after === before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.png`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.png`)
  }));

  stream.end();
});

test.cb('should minify JPG images with jpegRecompress', t => {
  t.plan(1);

  const stream = image({
    jpegRecompress : true,
    mozjpeg        : false,
    guetzli        : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.jpg').size;
    const after  = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.jpg`)
  }));

  stream.end();
});

test.cb('should minify JPG images with mozjpeg', t => {
  t.plan(1);

  const stream = image({
    jpegRecompress : false,
    mozjpeg        : true,
    guetzli        : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.jpg').size;
    const after  = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.jpg`)
  }));

  stream.end();
});

test.cb('should minify JPG images with guetzli', t => {
  t.plan(1);

  const stream = image({
    jpegRecompress : false,
    mozjpeg        : false,
    guetzli        : true
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.jpg').size;
    const after  = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.jpg`)
  }));

  stream.end();
});

test.cb('should not minify JPG images when related options are disabled', t => {
  t.plan(1);

  const stream = image({
    jpegRecompress : false,
    mozjpeg        : false,
    guetzli        : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.jpg').size;
    const after  = file.contents.length;
    t.true(after === before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.jpg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.jpg`)
  }));

  stream.end();
});

test.cb('should minify GIF images', t => {
  t.plan(1);

  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.gif').size;
    const after  = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path     :  `${__dirname}/fixtures/test.gif`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.gif`)
  }));

  stream.end();
});

test.cb('should not minify GIF images when related options are disabled', t => {
  t.plan(1);

  const stream = image({
    gifsicle : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.gif').size;
    const after  = file.contents.length;
    t.true(after === before);
    t.end();
  });

  stream.write(new Vinyl({
    path     :  `${__dirname}/fixtures/test.gif`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.gif`)
  }));

  stream.end();
});

test.cb('should minify SVG images', t => {
  t.plan(1);

  const stream = image();

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.svg').size;
    const after  = file.contents.length;
    t.true(after < before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.svg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.svg`)
  }));
});

test.cb('should not minify SVG images when related options are disabled', t => {
  t.plan(1);

  const stream = image({
    svgo : false
  });

  stream.on('data', file => {
    const before = fs.statSync('test/fixtures/test.svg').size;
    const after  = file.contents.length;
    t.true(after === before);
    t.end();
  });

  stream.write(new Vinyl({
    path     : `${__dirname}/fixtures/test.svg`,
    contents : fs.readFileSync(`${__dirname}/fixtures/test.svg`)
  }));
});

test.cb('should skip unsupported images', t => {
  t.plan(1);

  const stream = image();

  stream.on('data', file => {
    t.is(file.contents, null);
    t.end();
  });

  stream.write(new Vinyl({
    path : `${__dirname}fixtures/test.bmp`
  }));

  stream.end();
});
