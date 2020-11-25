require('dotenv').config()
const log = require('skog')
const { logSisImportErrors } = require('../lib/index')

async function start () {
  log.info('This function fetches all SIS Import Errors that happened recently')
  const now = new Date()
  const date = now.setHours(now.getHours() - 10)
  await logSisImportErrors(date)
}

start()
