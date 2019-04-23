const mongoose = require('mongoose')
const { log, error, info } = require('../utils/logging')
console.log(process.env.dbUri)
function connectDb() {
  mongoose.connect(
    process.env.dbUri,
    {
      useNewUrlParser: true
    }
  )

  mongoose.connection.on('connected', () => {
    log('Mongoose default connection is open to ', process.env.dbUri)
  })

  mongoose.connection.on('error', err => {
    error('Mongoose default connection has occured ' + err + ' error')
  })

  mongoose.connection.on('disconnected', () => {
    info('Mongoose default connection is disconnected')
  })

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      info('Mongoose default connection is disconnected due to application termination')
    })
  })
}

module.exports = connectDb()
