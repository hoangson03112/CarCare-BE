const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/', billController.getAllBills);
router.post('/', billController.createBill);
router.get('/:id', billController.getBillById);
router.put('/:id', billController.updateBill);

module.exports = router;