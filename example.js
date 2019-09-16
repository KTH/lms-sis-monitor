require('dotenv').config()
const subDays = require('date-fns/subDays')
const { fetchImportErrors } = require('./lib/canvas')
const parseError = require('./lib/parseError')
const whitelistError = require('./lib/whitelistError')

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
  const errors = []

  const rawErrors = fetchImportErrors(yesterday)
  for await (const rawError of rawErrors) {
    const parsed = parseError(rawError)
    const whitelist = whitelistError(parsed)

    if (!whitelist) {
      errors.push({ raw: rawError, parsed })
    }
  }

  console.log(errors.length)
}

start()
