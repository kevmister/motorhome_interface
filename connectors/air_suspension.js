"use strict"

module.exports = async resources => {
  const
    render = {
      readings: async () => ({
        connector: 'air_suspension',
        path: 'motorhome/engine/air_suspension/outbound/',
        sensors: [
          {
            connector: 'mqtt',
            path: 'motorhome/engine/air_suspension/outbound/sensors/accelerometer/angle_x',
            title: 'VEHICLE PITCH',
            unit: '°',
            min: -30,
            max: 30,
            step: 0.1
          },
          {
            connector: 'mqtt',
            path: 'motorhome/engine/air_suspension/outbound/sensors/accelerometer/angle_y',
            title: 'VEHICLE ROLL',
            unit: '°',
            min: -30,
            max: 30,
            step: 0.1
          },
          {
            connector: 'mqtt',
            path: 'motorhome/engine/air_suspension/outbound/sensors/accelerometer/temperature',
            title: 'AIR SUSPENSION TEMPERATURE',
            unit: '°C',
            min: -30,
            max: 50
          }
        ],
        controls: []
      })
    },
    client = {
      receive: async ({ path, data, client }) => {
        
      } 
    }
    

  return {
    render,
    client
  }
}