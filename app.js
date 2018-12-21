require('./config/environment')
const express = require('express')
const path = require('path')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const users = require('./routes/api/authentication')

const app = express()

app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(cookieParser('secret'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/users',users)


if (process.env.NODE_ENV === 'production'){
  app.use(express.static('client/build'))
  app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}


module.exports = {app}


