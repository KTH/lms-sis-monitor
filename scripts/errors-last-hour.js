require('dotenv').config()
const log = require('skog')
const { logSisImportErrors } = require('../lib/index')
const subHours = require('date-fns/subHours')

async function start () {
  log.info('This function fetches all SIS Import Errors that happened in the last 1 hour')
  const oneHourAgo = subHours(new Date(), 1)
  await logSisImportErrors(oneHourAgo)
}

start()
