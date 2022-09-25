const express = require('express')
const router = express.Router()
const Designations  = require('../models/designations')
const DesignationsController = require('../controller/designationsController')

router.get('/',DesignationsController.index)
router.post('/addDesignation',DesignationsController.addDesignation)
router.post('/deleteDesignation',DesignationsController.deleteDesignation)

module.exports = router