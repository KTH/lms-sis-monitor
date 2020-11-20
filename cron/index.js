const { scheduleJob } = require('node-schedule')
const log = require('skog')
const dateFns = require('date-fns')
const { logSisImportErrors } = require('../lib/index')

function sleep (t) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}

// Every 4 hours
const INTERVAL = 4 * 3600 * 1000
let job
let running = false

async function sync () {
  if (running) {
    return
  }

  running = true

  const oneDayBack = dateFns.subDays(new Date(), 1)
  await logSisImportErrors(oneDayBack)

  running = false
}

async function start () {
  while (true) {
    await sync()
    log.info(`Next invocation: ${new Date(Date.now() + INTERVAL)}`)
    await sleep(INTERVAL)
  }
}

module.exports = {
  start
}
