const CanvasAPI = require('@kth/canvas-api')
const canvas = CanvasAPI(
  process.env.CANVAS_API_URL,
  process.env.CANVAS_API_TOKEN
)

/**
 * Fetch import errors that happened between `startDate` and the current date.
 */
async function * fetchFailedImports (startDate) {
  const imports = canvas.listPaginated('/accounts/1/sis_imports', {
    created_since: startDate.toISOString()
  })

  for await (const page of imports) {
    for (const imp of page.sis_imports) {
      if (imp.workflow_state !== 'imported') {
        yield imp
      }
    }
  }
}

module.exports = {
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
