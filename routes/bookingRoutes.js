const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/auth");

router.get("/", bookingController.getAllBookings);
router.post("/", authMiddleware, bookingController.createBooking);
router.get(
  "/BookingsByGarage",
  authMiddleware,
  bookingController.getBookingsByGarage
);

router.patch("/:id", bookingController.updateBooking);

module.exports = router;
