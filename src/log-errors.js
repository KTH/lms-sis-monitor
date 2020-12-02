const CanvasAPI = require('@kth/canvas-api')
const canvas = CanvasAPI(
  process.env.CANVAS_API_URL,
  process.env.CANVAS_API_TOKEN
)

const log = require('skog')

/**
 * Log SIS Import Errors that happened between `startDate` and now. Log only
 * errors on given apps
 */
module.exports = async function logErrors (startDate, apps) {
  const errors = fetchImportErrors(startDate, apps)

  for await (const err of errors) {
    log.error(
      { err },
      `SIS Import ID ${err.sis_import_id}, Error: ${err.message}`
    )
  }
}

async function * fetchImportErrors (startDate, prefixes) {
  for await (const failedImport of fetchFailedImports(startDate, prefixes)) {
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
