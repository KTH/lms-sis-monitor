const canvas = require('./canvas')
const log = require('skog')
const parseErrorMessage = require('./parse-error-message')
const isKnownError = require('./is-known-error')

/** Log SIS Import Errors that happened between `startDate` and now */
module.exports.logSisImportErrors = async function logSisImportErrors (
  startDate
) {
  const count = {
    knownErrors: 0,
    unknownErrors: 0
  }
  for await (const err of canvas.fetchImportErrors(startDate)) {
    const parsedError = parseErrorMessage(err.message)

    if (!parsedError) {
      log.error({ err }, `SIS Import ID ${err.sis_import_id}, Error: ${err.message}`)
      continue
    }

    if (await isKnownError(parsedError)) {
      count.knownErrors++
    } else {
      log.error({ parsedError }, `SIS Import ID ${err.sis_import_id}, Error: ${err.message}`)
      count.unknownErrors++
    }
  }

  log.info(
    `Total number of errors. Known: ${count.knownErrors}. Unknown: ${
      count.unknownErrors
    }. Total: ${count.unknownErrors + count.knownErrors}`
  )
}
