const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.get('/byName/:name', serviceController.getServiceByName);
router.get('/', serviceController.getAllServices);

module.exports = router;