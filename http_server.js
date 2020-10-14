"use strict"

const run  = async () => {
  const
    express = require('express'),
    app = express()

  app.use(express.static('www'))
  app.listen(1974)
}

run()