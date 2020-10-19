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
  //await jobs.load()

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

  /*
  setInterval(() => {
    for(const client of wss.clients)
      if(client.readyState = ws.OPEN)
        client.send(JSON.stringify({connector: 'air_suspension.js', path: 'data.bag_pressure.driver', data: { value: 90 }}))
  }, 1000)
  */

  server.listen(1974, () => console.info(`Server listening on port ${1974}`))
}

run()