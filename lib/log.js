'use strict';
const {round10} = require('round10');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const filesize = require('filesize');

module.exports = (filePath, originalSize, optimizedSize) => {
  const diffSize = originalSize - optimizedSize;
  const diffPercent = round10(100 * (diffSize / originalSize), -1);

  if (diffSize <= 0) {
    fancyLog.info(
      colors.green('- ') + filePath + colors.gray(' ->') +
      colors.gray(' Cannot improve upon ') + colors.cyan(filesize(originalSize))
    );
  } else {
    fancyLog.info(
      colors.green('✔ ') + filePath + colors.gray(' ->') +
      colors.gray(' before=') + colors.yellow(filesize(originalSize)) +
      colors.gray(' after=') + colors.cyan(filesize(optimizedSize)) +
      colors.gray(' reduced=') + colors.green(`${filesize(diffSize)} (${diffPercent}%)`)
    );
  }
};
