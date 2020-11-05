"use strict"

const run  = async () => {
  const
    http = require('http'),
    express = require('express'),
    ws = require('ws'),
    mqtt = require('mqtt'),
    app = express(),
    server = http.createServer(app),
    wss = new ws.Server({ server })

  app.use(express.static('www'))

  const
    fs = require('fs').promises,
    loader = async ({ directory,path='',callback }) => {
      const
        files = await fs.readdir(`${directory}/${path}`)

      for(const file of files){
        const
          stat = await fs.lstat(`${directory}/${path}/${file}`)

        if(stat.isFile())
          await callback({ directory,path,file,filename: file.substr(0, file.lastIndexOf('.')) })

        if(stat.isDirectory())
          await loader({ directory, path: `${path}${file}/`, callback })
      }
    },
    resources = {
      wss,
      connectors: null,
      jobs: null,
      shared: {
        transmit: async ({ connector, path='', data={} }) => {
          for(const client of wss.clients)
            if(client.readyState = ws.OPEN)
              client.send(JSON.stringify({connector, path, data, client: null }))

          for(const connector of Object.values(connectors.loaded))
            if(typeof connector.receive === 'function')
              await connector.receive({ connector, path, data, client: null })

          for(const job of Object.values(jobs.loaded))
            if(typeof job.receive === 'function')
              await job.receive({ connector, path, data, client: null })
        }
      }
    },
    connectors = {
      loaded: {},
      load: async ({ directory='connectors' }={}) => {
        await loader({ 
          directory,
          callback: async ({ directory,path,file,filename }) => {
            console.info(`Loading connector: ${path}${file}`)
            const
              connector = await require(`${__dirname}/${directory}/${path}/${file}`)(resources)

            connectors.loaded[`${path}${filename}`] = connector
          }
        })
      }
    },
    jobs = {
      loaded: {},
      load: async ({ directory='jobs' }={}) => {
        await loader({ 
          directory,
          callback: async ({ directory,path,file,filename }) => {
            console.info(`Loading job: ${path}${file}`)
            const
              job = await require(`${__dirname}/${directory}/${path}/${file}`)(resources)

            jobs.loaded[`${path}${filename}`] = job
          }
        })
      }
    }

  resources.connectors = connectors
  resources.jobs = jobs

  await connectors.load()
  await jobs.load()

  app.get('/readings.json', async (req,res) => {
    const
      filter = connector => 'render' in connector && 'readings' in connector.render,
      map = async connector => connector.render.readings(),
      readings = await Promise.all(Object.values(connectors.loaded).filter(filter).map(map))

    res.send(readings)
  })

  wss.on('connection', async client => {
    client.on('message', async message => {
      const
        { connector, path, data={} } = JSON.parse(message.data),
        connectorData = { connector, path, data, client }

      for(connector of Object.keys(connectors.loaded))
        if('client' in connector && 'receive' in connector.client)
          await connector.client.receive(connectorData)

    })
  })

  const
    client = mqtt.connect('mqtt://localhost')

  client.on('connect', () => {
    client.subscribe('motorhome/#')
  })

  client.on('message', (topic,messageRaw) => {
    const
      message = messageRaw.toString(),
      connectorData = { topic,message },
      clientData = JSON.stringify({ connector: 'mqtt', path: topic, data: { message } })

    for(const connector of Object.values(connectors.loaded))
      if('mqtt' in connector)
        connector.mqtt(connectorData)

    for(const client of wss.clients)
      if(client.readyState = ws.OPEN)
        client.send(clientData)

  })

  server.listen(1974, () => console.info(`Server listening on port ${1974}`))
}

run()