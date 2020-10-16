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

  wss.on('connection', async client => {

    console.info(`WebSocket: client connected`)
    client.on('message', async message => {})

    /*
    const
      heartbeat = setInterval(() => client.send('pinger'), 15000)
    

    //client.on('close', () => clearInterval(heartbeat))
    //client.on('error', () => clearInterval(heartbeat))
    */
  })

  setInterval(() => {
    for(const client of wss.clients)
      if(client.readyState = ws.OPEN)
        client.send(JSON.stringify({namespace: 'engine.data.oil_pressure', data: { value: Math.random()*250|0 }}))
  }, 1000)

  server.listen(1974, () => console.info(`Server listening on port ${1974}`))
}

run()