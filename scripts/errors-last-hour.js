require('dotenv').config()
const log = require('skog')
const { logSisImportErrors } = require('../lib/index')

async function start () {
  log.info('This function fetches all SIS Import Errors that happened recently')
  const now = new Date()
  const date = new Date()
  date.setHours(now.getHours() - 1)
  await logSisImportErrors(date)
}

start()
