const express = require('express')
const app = express()

// Only one endpoint. No routers, no middlewares.
app.get(`${process.env.PROXY_PREFIX_PATH}/_monitor`, (req, res) => {
  res.header('content-type', 'text/plain')
  res.send('APPLICATION_STATUS: OK')
})

module.exports = app
