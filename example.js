require('dotenv').config()
const subDays = require('date-fns/subDays')
const fetchImportErrors = require('./lib/fetchImportErrors')
const skog = require('skog/bunyan')
skog.createLogger({
  name: 'lms-sis-monitor',
  level: 'trace'
})
/**
 * Use cases for functions contained in `lib` directory
 */
async function start () {
  const yesterday = subDays(new Date(), 1)

  skog.info(`Fetching errors from ${yesterday}`)
  const errors = await fetchImportErrors(yesterday)
  skog.info(`Found ${errors.length} errrors`)
}

start()
