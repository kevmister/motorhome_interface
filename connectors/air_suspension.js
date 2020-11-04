"use strict"

module.exports = async resources => {
  const
    render = {
      readings: async () => ({
        connector: 'air_suspension',
        path: 'motorhome/engine/air_suspension/outbound/',
        sensors: [
          {
            path: 'sensors/accelerometer/acceleration_x',
            title: 'VEHICLE PITCH',
            unit: '°',
            min: -30,
            max: 30,
            step: 0.1
          },
          {
            path: 'sensors/accelerometer/acceleration_y',
            title: 'VEHICLE ROLL',
            unit: '°',
            min: -30,
            max: 30,
            step: 0.1
          }
        ],
        controls: []
      })
    },
    receive = async ({ path, data, client }) => {
      
    }

  return {
    render,
    receive
  }
}