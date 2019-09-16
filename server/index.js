const express = require('express')
const app = express()
const errorStorage = require('../lib/errorStorage')

// Only one endpoint. No routers, no middlewares.
app.get('/', (req, res) => {
  let result = 'Errors: \n-------------\n'
  for (const [key, value] of errorStorage.get()) {
    result += `${value.length} -- ${key}\n`
  }

  res.header('content-type', 'text/plain')
  res.send(result)
})

module.exports = app
