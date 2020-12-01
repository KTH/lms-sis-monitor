const CanvasAPI = require('@kth/canvas-api')
const canvas = CanvasAPI(
  process.env.CANVAS_API_URL,
  process.env.CANVAS_API_TOKEN
)
const log = require('skog')

/** Check if any name element of "names" starts with any of the "prefixes" */
function anyStartsWith (names = [], prefixes = []) {
  for (const name of names) {
    for (const prefix of prefixes) {
      if (name.startsWith(prefix)) {
        return true
      }
    }
  }

  return false
}

/**
 * Fetch failed "SIS Imports" (not the errors) that happened between `startDate`
 * and the current date.
 *
 * @param {string[]?} prefixes If passed, returns only errors that ocurred with
 *   filenames that start with any of them
 */
async function * fetchFailedImports (startDate, prefixes = []) {
  log.info(`Fetching from ${startDate.toISOString()}`)
  const imports = canvas.listPaginated('/accounts/1/sis_imports', {
    created_since: startDate.toISOString()
  })

  for await (const page of imports) {
    for (const imp of page.sis_imports) {
      const attachments = imp.csv_attachments

      if (imp.workflow_state !== 'imported') {
        if (prefixes.length === 0) {
          yield imp
        }

        const filenames = attachment.map(attachment => attachment.filename)
        if (anyStartsWith(filenames, prefixes)) {
          yield imp
        }
      }
    }
  }
}

module.exports = {
  /**
   * Fetch all "SIS Import Errors" (i.e. why a SIS Import has failed) from
   * `startDate` to now
   */
  async * fetchImportErrors (startDate) {
    for await (const failedImport of fetchFailedImports(startDate)) {
      const errors = canvas.listPaginated(
        `/accounts/1/sis_imports/${failedImport.id}/errors`
      )

      for await (const page of errors) {
        for (const err of page.sis_import_errors) {
          yield err
        }
      }
    }
  }
}
