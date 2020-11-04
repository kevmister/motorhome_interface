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
    loader = async ({ directory,callback }) => {
      const
        dirpath = `${directory}`,
        files = await fs.readdir(dirpath)

      for(const file of files){
        const
          filepath = `${dirpath}/${file}`,
          stat = await fs.lstat(filepath)

        if(stat.isFile())
          await callback({ dirpath,filepath,file })

        if(stat.isDirectory())
          await loader({ directory: filepath, callback })
      }
    },
    resources = {
      wss,
      connectors: null,
      jobs: null,
      shared: {
        transmit: async ({ connector, path, data={} }) => {
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
          callback: async ({ dirpath,filepath,file }) => {
            console.info(`Loading connector: ${filepath}`)
            const
              connector = await require(`${__dirname}/${filepath}`)(resources)

            connectors.loaded[filepath.substring(directory.length+1)] = connector
          }
        })
      }
    },
    jobs = {
      loaded: {},
      load: async ({ directory='jobs' }={}) => {
        await loader({ 
          directory,
          callback: async ({ dirpath,filepath,file }) => {
            console.info(`Loading job: ${filepath}`)
            const
              job = await require(`${__dirname}/${filepath}`)(resources)

            jobs.loaded[filepath.substring(directory.length+1)] = job
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
        { connector, path, data={} } = JSON.parse(message.data)

      for(connector of Object.keys(connectors.loaded))
        if(typeof connector.receive === 'function')
          await connector.receive({ connector, path, data, client })

      for(job of Object.keys(jobs.loaded))
        if(typeof job.receive === 'function')
          await job.receive({ connector, path, data, client })

    })
  })

  const
    client = mqtt.connect('mqtt://localhost')

  client.on('connect', () => {
    client.subscribe('motorhome/#')
  })

  client.on('message', (topic,message) => {
    //console.log(`${topic}: ${message.toString()}`)
    const
      broadcast =  ({ json }) => {
        for(const client of wss.clients)
          if(client.readyState = ws.OPEN)
            client.send(json)
      },
      elements = topic.split('/'),
      namespace = elements[1]


    if(topic === 'motorhome/engine/air_suspension/outbound/sensors/accelerometer/temperature'){
      const
        json = JSON.stringify({connector: 'air_suspension.js', path: 'sensors/accelerometer/temperature', data: { value: message.toString()*1 }})

      broadcast({ json })
    }
    if(topic === 'motorhome/engine/air_suspension/outbound/sensors/accelerometer/angle_x'){
      const
        json = JSON.stringify({connector: 'air_suspension.js', path: 'sensors/accelerometer/angle_x', data: { value: message.toString()*1 }})

      broadcast({ json })
    }
    if(topic === 'motorhome/engine/air_suspension/outbound/sensors/accelerometer/angle_y'){
      const
        json = JSON.stringify({connector: 'air_suspension.js', path: 'sensors/accelerometer/angle_y', data: { value: message.toString()*1 }})

      broadcast({ json })
    }
    if(topic === 'motorhome/engine/air_suspension/outbound/sensors/accelerometer/angle_z'){
      const
        json = JSON.stringify({connector: 'air_suspension.js', path: 'sensors/accelerometer/angle_z', data: { value: message.toString()*1 }})

      broadcast({ json })
    }
  })

  /*
  setInterval(() => {
    
  }, 1000)
  */

  server.listen(1974, () => console.info(`Server listening on port ${1974}`))
}

run()