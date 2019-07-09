const express = require('express')
const useragent = require('express-useragent')
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser)

const reports = require('../methods/reports')

const router = express.Router()
router.use(useragent.express())

router.use(bodyParser.text({ limit: '50mb' }))
router.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

router.get('/job', reports.generateCsv)

module.exports = router
