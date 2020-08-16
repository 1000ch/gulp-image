'use strict';
const {round10} = require('round10');
const fancyLog = require('fancy-log');
const colors = require('ansi-colors');
const prettyBytes = require('pretty-bytes');

module.exports = (filePath, originalBytes, optimizedBytes) => {
  const difference = originalBytes - optimizedBytes;
  const percent = round10(100 * (difference / originalBytes), -1);

  if (difference <= 0) {
    fancyLog.info(
      colors.green('- ') + filePath + colors.gray(' ->') +
      colors.gray(' Cannot improve upon ') + colors.cyan(prettyBytes(originalBytes))
    );
  } else {
    fancyLog.info(
      colors.green('✔ ') + filePath + colors.gray(' ->') +
      colors.gray(' before=') + colors.yellow(prettyBytes(originalBytes)) +
      colors.gray(' after=') + colors.cyan(prettyBytes(optimizedBytes)) +
      colors.gray(' reduced=') + colors.green(`${prettyBytes(difference)} (${percent}%)`)
    );
  }
};
