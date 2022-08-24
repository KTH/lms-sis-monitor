const CanvasAPI = require("@kth/canvas-api").default;
const log = require("skog");

const canvas = new CanvasAPI(
  process.env.CANVAS_API_URL,
  process.env.CANVAS_API_TOKEN,
  {
    timeout: 10 * 1000,
    retry: {
      limit: 5,
    },
  }
);

function anyStartsWith(names = [], prefixes = []) {
  for (const name of names) {
    for (const prefix of prefixes) {
      if (name.startsWith(prefix)) {
        return true;
      }
    }
  }

  return false;
}

async function* fetchFailedImports(startDate, prefixes = []) {
  log.info(`Fetching from ${startDate.toISOString()}`);
  const imports = canvas.listPages("accounts/1/sis_imports", {
    created_since: startDate.toISOString(),
  });

  for await (const page of imports) {
    const { sis_imports } = page.body;
    for (const sisImport of sis_imports) {
      const attachments = sisImport.csv_attachments;

      // workflow_stage != "imported" means "with errors"
      if (sisImport.workflow_state !== "imported" && attachments) {
        const filenames = attachments.map((attachment) => attachment.filename);
        if (anyStartsWith(filenames, prefixes)) {
          yield sisImport;
        }
      }
    }
  }
}

async function* fetchImportErrors(startDate, prefixes) {
  for await (const failedImport of fetchFailedImports(startDate, prefixes)) {
    log.info(`Fetching errors for SIS Import ID: ${failedImport.id}`);
    const errors = canvas.listPaginated(
      `accounts/1/sis_imports/${failedImport.id}/errors`
    );

    for await (const page of errors) {
      for (const err of page.sis_import_errors) {
        yield err;
      }
    }
  }
}

/**
 * Log SIS Import Errors that happened between `startDate` and now. Log only
 * errors on given apps
 *
 * Note: if no "apps" is given, it will return nothing.
 */
module.exports = async function logErrors(startDate, apps) {
  const errors = fetchImportErrors(startDate, apps);

  for await (const err of errors) {
    log.error(
      { err },
      `SIS Import ID ${err.sis_import_id}, Error: ${err.message}`
    );
  }
};
