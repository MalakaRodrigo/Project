const express = require("express");
const router = express.Router();
const ClientsController = require('../controller/clientsController')
const Clients = require('../models/clients')

router.post('/addClients',ClientsController.addClient)
router.post('/addMeeting',ClientsController.addMeeting)
router.post('/addProject',ClientsController.addProject)
router.get('/getClients',ClientsController.getClients)
router.post('/deleteClient',ClientsController.deleteClient)
module.exports = router