const express = require('express')
const app = express()
const errorStorage = require('../lib/errorStorage')

// Only one endpoint. No routers, no middlewares.
app.get(process.env.PROXY_PREFIX_PATH, (req, res) => {
  let result = 'Errors: \n-------------\n'
  for (const [key, value] of errorStorage.get()) {
    result += `${value.length} -- ${key}\n`
  }

  res.header('content-type', 'text/plain')
  res.send(result)
})

app.get(`${process.env.PROXY_PREFIX_PATH}/_monitor`, (req, res) => {
  res.header('content-type', 'text/plain')
  res.send('APPLICATION_STATUS: OK')
})

module.exports = app
