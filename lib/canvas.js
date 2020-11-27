const CanvasAPI = require('@kth/canvas-api')
const canvas = CanvasAPI(
  process.env.CANVAS_API_URL,
  process.env.CANVAS_API_TOKEN
)
const log = require('skog')

/**
 * Fetch failed "SIS Imports" (not the errors) that happened between `startDate`
 * and the current date.
 */
async function * fetchFailedImports (startDate) {
  log.info(`Fetching from ${startDate.toISOString()}`)
  const imports = canvas.listPaginated('/accounts/1/sis_imports', {
    created_since: startDate.toISOString()
  })

  for await (const page of imports) {
    for (const imp of page.sis_imports) {
      const attachments = imp.csv_attachments

      if (imp.workflow_state !== 'imported') {
        if (attachments.find(attachment => attachment.filename.startsWith('lms-activity-rooms')))
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
  },

  /** Returns true if user with `sisId` exists in Canvas */
  async userExists (sisId) {
    try {
      await canvas.get(`/users/sis_user_id:${sisId}`)
      return true
    } catch (err) {
      if (err.statusCode === 404) {
        return false
      } else {
        throw err
      }
    }
  }
}
