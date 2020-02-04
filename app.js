require('dotenv').config()
require('@kth/reqvars').check()
const skog = require('skog/bunyan')
const server = require('./server')
const cron = require('./cron')

skog.createLogger({
  app: 'lms-sis-monitor',
  name: 'lms-sis-monitor',
  level: 'info'
})

cron.start()
server.listen(3000)
