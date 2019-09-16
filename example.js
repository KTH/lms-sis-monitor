require('dotenv').config()
const subDays = require('date-fns/subDays')
const { fetchImportErrors } = require('./lib/canvas')
const parseError = require('./lib/parseError')
const errorGroup = require('./lib/errorGroup')

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
  const group = errorGroup()

  const rawErrors = fetchImportErrors(yesterday)
  for await (const rawError of rawErrors) {
    const parsed = parseError(rawError)

    group.add({ raw: rawError, parsed })
  }

  for (const [key, value] of group.list()) {
    console.log(key, value.length)
  }
}

start()
