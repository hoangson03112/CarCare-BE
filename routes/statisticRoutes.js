const express = require('express');
const router = express.Router();
const statisticController = require('../controllers/statisticController');


router.get('/day/:garageId', statisticController.getStatisticsByDay);
router.get('/month/:garageId', statisticController.getStatisticsByMonth);
router.get('/year/:garageId', statisticController.getStatisticsByYear);

module.exports = router;
