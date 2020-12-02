require('dotenv').config()
require('@kth/reqvars').check()
require('skog/bunyan').createLogger({
  app: 'lms-sis-monitor',
  name: 'lms-sis-monitor',
  level: 'info'
})

const server = require('./src/server')
const runPeriodically = require('./run-periodically')

runPeriodically()
server.listen(3000)
