"use strict"

const run  = async () => {
  const
    http = require('http'),
    express = require('express'),
    ws = require('ws'),
    app = express(),
    server = http.createServer(app),
    wss = new ws.Server({ server })

  app.use(express.static('www'))

  wss.on('connection', async ws => {

    ws.on('message', async message => {})

    const
      heartbeat = setInterval(() => connection.send('ping'), 30000)

    ws.on('close', () => clearInterval(heartbeat))
    ws.on('error', () => clearInterval(heartbeat))
  })

  server.listen(1974, () => console.info(`Server listening on port ${1974}`))
}

run()