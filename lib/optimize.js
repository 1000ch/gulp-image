import {Buffer} from 'node:buffer';
import execBuffer from 'exec-buffer';
import isPng from 'is-png';
import isJpg from 'is-jpg';
import isGif from 'is-gif';
import isSvg from 'is-svg';
import optipng from 'optipng-bin';
import pngquant from 'pngquant-bin';
import zopflipng from 'zopflipng-bin';
import jpegRecompress from 'jpeg-recompress-bin';
import mozjpeg from 'mozjpeg';
import gifsicle from 'gifsicle';
import svgo from 'svgo';

function useOptipng(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['-i 1', '-strip all', '-fix', '-o7', '-force'];

  return execBuffer({
    input: buffer,
    bin: optipng,
    args: [...parameters, '-out', execBuffer.output, execBuffer.input],
  });
}

async function usePngquant(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['--speed=1', '--force', 256];

  return execBuffer({
    input: buffer,
    bin: pngquant,
    args: [...parameters, '--output', execBuffer.output, execBuffer.input],
  });
}

async function useZopflipng(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['-y', '--lossy_8bit', '--lossy_transparent'];

  return execBuffer({
    input: buffer,
    bin: zopflipng,
    args: [...parameters, execBuffer.input, execBuffer.output],
  });
}

async function useJpegRecompress(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['--strip', '--quality', 'medium', '--min', 40, '--max', 80];

  return execBuffer({
    input: buffer,
    bin: jpegRecompress,
    args: [...parameters, execBuffer.input, execBuffer.output],
  });
}

async function useMozjpeg(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['-optimize', '-progressive'];

  return execBuffer({
    input: buffer,
    bin: mozjpeg,
    args: [...parameters, '-outfile', execBuffer.output, execBuffer.input],
  });
}

async function useGifsicle(buffer, args) {
  const parameters = Array.isArray(args) ? args : ['--optimize'];

  return execBuffer({
    input: buffer,
    bin: gifsicle,
    args: [...parameters, '--output', execBuffer.output, execBuffer.input],
  });
}

async function useSvgo(buffer, args) {
  const options = (args !== null && typeof args === 'object') ? args : {};
  const {data} = svgo.optimize(buffer, options);

  return Buffer.from(data);
}

const optimize = async (buffer, options) => {
  if (isJpg(buffer)) {
    if (options.jpegRecompress) {
      buffer = await useJpegRecompress(buffer, options.jpegRecompress);
    }

    if (options.mozjpeg) {
      buffer = await useMozjpeg(buffer, options.mozjpeg);
    }
  } else if (isPng(buffer)) {
    if (options.pngquant) {
      buffer = await usePngquant(buffer, options.pngquant);
    }

    if (options.optipng) {
      buffer = await useOptipng(buffer, options.optipng);
    }

    if (options.zopflipng) {
      buffer = await useZopflipng(buffer, options.zopflipng);
    }
  } else if (isGif(buffer) && options.gifsicle) {
    buffer = await useGifsicle(buffer, options.gifsicle);
  } else if (isSvg(buffer) && options.svgo) {
    buffer = await useSvgo(buffer, options.svgo);
  }

  return buffer;
};

export default optimize;
