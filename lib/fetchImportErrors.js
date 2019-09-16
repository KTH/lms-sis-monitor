const CanvasAPI = require('@kth/canvas-api')
const canvas = CanvasAPI(process.env.CANVAS_API_URL, process.env.CANVAS_API_TOKEN)

/**
 * Fetch import errors that happened between `startDate` and the current date.
 */
module.exports = async function fetchImportErrors (startDate) {
  const imports = canvas.listPaginated('/accounts/1/sis_imports', {
    created_since: startDate.toISOString()
  })

  const failed = []
  for await (const page of imports) {
    for (const imp of page.sis_imports) {
      if (imp.workflow_state !== 'imported') {
        failed.push(imp)
      }
    }
  }

  return failed
}
