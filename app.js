require('dotenv').config()
require('@kth/reqvars').check()
require('skog/bunyan').createLogger({
  app: 'lms-sis-monitor',
  name: 'lms-sis-monitor',
  level: 'info'
})

const server = require('./server')
const cron = require('./cron')

cron.start()
server.listen(3000)
