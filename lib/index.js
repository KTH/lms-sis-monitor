const canvas = require('./canvas')
const log = require('skog')
const parseError = require('./parse-error')
const isKnownError = require('./is-known-error')

/** Log SIS Import Errors that happened between `startDate` and now */
module.exports.logSisImportErrors = async function logSisImportErrors (startDate) {
  const count = {
    knownErrors: 0,
    unknownErrors: 0
  }
  for await (const err of canvas.fetchImportErrors(startDate)) {
    const parsedError = parseError(err)

    if (!parsedError) {
      log.error(err, 'SIS Import Error')
      continue;
    }

    if (await isKnownError(parsedError)) {
      count.knownErrors++
    } else {
      log.error(parsedError, 'SIS Import Error')
      count.unknownErrors++
    }
  }

  log.info(`Total number of errors. Known: ${count.knownErrors}. Unknown: ${count.unknownErrors}. Total: ${count.unknownErrors + count.knownErrors}`)
}
