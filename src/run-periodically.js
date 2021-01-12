const log = require('skog')
const logErrors = require('./log-errors')

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

  const now = new Date()
  const oneDayBack = new Date()
  oneDayBack.setDate(now.getDate() - 1)

  const apps = ['lms-activity-rooms', 'lms-antagna']

  await logErrors(oneDayBack, apps)

  running = false
}

module.exports = async function start () {
  while (true) {
    await sync()
    log.info(`Next invocation: ${new Date(Date.now() + INTERVAL)}`)
    await sleep(INTERVAL)
  }
}
