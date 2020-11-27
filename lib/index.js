const canvas = require('./canvas')
const log = require('skog')
const parseErrorMessage = require('./parse-error-message')

/** Log SIS Import Errors that happened between `startDate` and now */
module.exports.logSisImportErrors = async function logSisImportErrors (
  startDate
) {
  for await (const err of canvas.fetchImportErrors(startDate)) {
    const parsedError = parseErrorMessage(err.message)

    if (!parsedError) {
      log.error({ err }, `SIS Import ID ${err.sis_import_id}, Error: ${err.message}`)
      continue
    }

    log.error({ parsedError }, `SIS Import ID ${err.sis_import_id}, Error: ${err.message}`)
  }
}
