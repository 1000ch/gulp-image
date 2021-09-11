import {round10} from 'round10';
import fancyLog from 'fancy-log';
import colors from 'ansi-colors';
import prettyBytes from 'pretty-bytes';

const log = (filePath, originalBytes, optimizedBytes) => {
  const difference = originalBytes - optimizedBytes;
  const percent = round10(100 * (difference / originalBytes), -1);

  if (difference <= 0) {
    fancyLog.info(
      colors.green('- ') + filePath + colors.gray(' ->')
      + colors.gray(' Cannot improve upon ') + colors.cyan(prettyBytes(originalBytes)),
    );
  } else {
    fancyLog.info(
      colors.green('✔ ') + filePath + colors.gray(' ->')
      + colors.gray(' before=') + colors.yellow(prettyBytes(originalBytes))
      + colors.gray(' after=') + colors.cyan(prettyBytes(optimizedBytes))
      + colors.gray(' reduced=') + colors.green(`${prettyBytes(difference)} (${percent}%)`),
    );
  }
};

export default log;
