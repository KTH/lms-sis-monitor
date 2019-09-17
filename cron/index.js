const { scheduleJob } = require('node-schedule')
const skog = require('skog/bunyan')
const subDays = require('date-fns/subDays')
const { fetchImportErrors } = require('../lib/canvas')
const parseError = require('../lib/parseError')
const errorGroup = require('../lib/errorGroup')
const errorStorage = require('../lib/errorStorage')
const cuid = require('cuid')

/**
 * Synchronizes SIS Import Errors every four hours
 */

// "0 */4 * * *" = "every 4th hour"
// More info: https://crontab.guru/#0_*/4_*_*_*
const INTERVAL = process.env.INTERVAL || '0 */4 * * *'
let job
let running = false

async function sync () {
  if (running) {
    return
  }

  running = true

  await skog.child({ req_id: cuid() }, async () => {
    skog.info('Starting sync...')

    const oneWeekAgo = subDays(new Date(), 7)

    skog.info(`Fetching errors from ${oneWeekAgo}`)
    const group = errorGroup()

    const rawErrors = fetchImportErrors(oneWeekAgo)
    for await (const rawError of rawErrors) {
      const parsed = parseError(rawError)

      group.add({ raw: rawError, parsed })
    }

    errorStorage.set(group.list())
  })
}

async function start () {
  job = scheduleJob(INTERVAL, async () => {
    await sync()
    skog.info(`Next sync is scheduled for: ${job.nextInvocation()}`)
  })
  await sync()
  skog.info(`Next sync is scheduled for: ${job.nextInvocation()}`)
}

function nextSync () {
  if (job) {
    return job.nextInvocation()
  } else {
    return 'synchronization not set'
  }
}

function isRunning () {
  return running
}

module.exports = {
  start,
  nextSync,
  isRunning
}
