const canvas = require('./canvas')
const log = require('skog')

/** Log SIS Import Errors that happened between `startDate` and now */
module.exports.logSisImportErrors = async function logSisImportErrors (startDate) {
  for await (const err of canvas.fetchImportErrors(startDate)) {
    log.info(`We found an error: ${err}`)
  }
}
