require('dotenv').config()
const skog = require('skog/bunyan')
const server = require('./server')
const cron = require('./cron')

skog.createLogger({
  app: 'lms-sis-monitor',
  level: 'info'
})

cron.start()
server.listen(3000)
