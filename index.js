import through2 from 'through2-concurrent';
import PluginError from 'plugin-error';
import optimize from './lib/optimize.js';
import log from './lib/log.js';

const image = (options = {}) => through2.obj({
  maxConcurrency: options.concurrent,
}, async (file, enc, callback) => {
  if (file.isNull()) {
    return callback(null, file);
  }

  if (file.isStream()) {
    return callback(new Error('gulp-image: Streaming is not supported'));
  }

  try {
    const originalBuffer = file.contents;
    const optimizedBuffer = await optimize(originalBuffer, {
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      gifsicle: true,
      svgo: true,
      ...options,
    });

    const originalBytes = originalBuffer.length;
    const optimizedBytes = optimizedBuffer.length;

    if (!options.quiet) {
      log(file.relative, originalBytes, optimizedBytes);
    }

    if (originalBytes - optimizedBytes > 0) {
      file.contents = optimizedBuffer;
    }

    callback(null, file);
  } catch (error) {
    callback(new PluginError('gulp-image', error));
  }
});

export default image;
