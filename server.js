const helmet = require('helmet')
const http = require('http')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const routes = require('./routes/routes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
let kue        = require('kue');
let ui         = require('kue-ui');

const cp = require('child_process')

let app = express()
const securePort = process.env.PORT || '8094'

app.use(cors())
app.use(cookieParser())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json({limit: '50mb'}))
app.use('/api', routes)
app.use(passport.initialize())

app.disable('x-powered-by')

ui.setup({
  apiURL: '/api_ui', // IMPORTANT: specify the api url
  baseURL: '/kue', // IMPORTANT: specify the base url
  updateInterval: 5000 // Optional: Fetches new data every 5000 ms
});

// Mount kue JSON api
app.use('/api_ui', kue.app);
// Mount UI
app.use('/kue', ui.app);

process.on('unhandledRejection', (reason, p) => {
  // console.log('Controlado en el process on en index')
  console.log(' Capturado Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

http.createServer(app, (request, response) => {
  request.on('error', (err) => {
    console.error(err)
    response.end()
  })
  }).listen(securePort, receptionStart(securePort))


function receptionStart (securePort) {
  console.log('app listening on port: ' + securePort)
  const executeWorker = require('./methods/worker')
}
