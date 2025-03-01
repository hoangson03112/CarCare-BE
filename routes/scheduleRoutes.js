const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/:garageId', scheduleController.getScheduleByGarage);
router.put('/update/:garageId', scheduleController.updateScheduleSlot);

module.exports = router;
