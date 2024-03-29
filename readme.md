# gulp-image ![GitHub Actions Status](https://github.com/1000ch/gulp-image/workflows/test/badge.svg?branch=main)

Optimize PNG, JPEG, GIF, SVG images with gulp task.

![gulp-image result](https://raw.github.com/1000ch/gulp-image/master/screenshot/terminal.png)

## Install

```bash
$ npm install --save-dev gulp-image
```

### External Dendencies

This package includes multiple image-related libraries so that you might be required to install several external dependencies like [`libjpeg`](http://libjpeg.sourceforge.net/) or [`libpng`](http://www.libpng.org/pub/png/libpng.html). Please install them as needed with [Homebrew](https://brew.sh/) on macOS or `apt` (Advanced Package Tool) on Linux.

## Usage

This is an example of `gulpfile.js`.

```javascript
import gulp from 'gulp';
import image from 'gulp-image';

gulp.task('image', () => {
  gulp.src('./fixtures/*')
    .pipe(image())
    .pipe(gulp.dest('./dest'));
});

gulp.task('default', ['image']);
```

You can pass an object to `image()` as argument such as following:

```javascript
gulp.task('image', () => {
  gulp.src('./fixtures/*')
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      concurrent: 10,
      quiet: true // defaults to false
    }))
    .pipe(gulp.dest('./dest'));
});
```

Set `false` for optimizers which you don't want to apply. And you can set `concurrent` option to limit the max concurrency in execution.  You can also set `quiet` to avoid logging out results for every image processed.

You can configure parameters applied to each optimizers such as following:

```javascript
gulp.task('image', () => {
  gulp.src('./fixtures/*')
    .pipe(image({
      optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
      pngquant: ['--speed=1', '--force', 256],
      zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
      jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
      mozjpeg: ['-optimize', '-progressive'],
      gifsicle: ['--optimize'],
      svgo: {} // svgo accepts options defined on https://github.com/svg/svgo#configuration
    }))
    .pipe(gulp.dest('./dest'));
});
```

## License

[MIT](https://1000ch.mit-license.org) © [Shogo Sensui](https://github.com/1000ch)
