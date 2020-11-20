require('dotenv').config()
const log = require('skog')
const { logSisImportErrors } = require('../lib/index')
const { subDays, subHours } = require('date-fns')

async function start () {
  log.info('This function fetches all SIS Import Errors that happened recently')
  await logSisImportErrors(subHours(new Date(), 10))
}

start()
