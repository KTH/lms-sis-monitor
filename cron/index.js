const { scheduleJob } = require('node-schedule')
const skog = require('skog')
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

  await skog.child({ req_id: cuid() }, async () => {
    const oneDayBack = dateFns.subDays(new Date(), 1)
    await logSisImportErrors()
  })

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
