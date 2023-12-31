import config from './../config/config'
import app from './express'
import mongoose from 'mongoose'


mongoose.Promise = global.Promise
mongoose.connect("mongodb+srv://novi-korisnik-1:novi-korisnik-1@cluster0.jlb4z0a.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.mongoUri}`)
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})
