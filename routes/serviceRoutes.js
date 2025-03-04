const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");

router.get("/:IDService", serviceController.getServiceByID);

router.get("/", serviceController.getAllServices);

module.exports = router;
