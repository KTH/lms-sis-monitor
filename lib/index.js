const canvas = require('./canvas')
const log = require('skog')
const parseErrorMessage = require('./parse-error-message')

/**
 * Log SIS Import Errors that happened between `startDate` and now. Log only
 * errors on given apps
 */
module.exports.logSisImportErrors = async function logSisImportErrors (
  startDate,
  apps
) {
  const errors = canvas.fetchImportErrors(startDate, apps)

  for await (const err of errors) {
    log.error(
      { err },
      `SIS Import ID ${err.sis_import_id}, Error: ${err.message}`
    )
  }
}
