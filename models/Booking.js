const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  garageId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  carInfo: { type: String, required: true },
  condition: { type: String, required: true },
  service: { type: String, required: true },
  time: { type: Date, required: true },
  status: { type: String, default: "pending" }, // pending, accepted, rejected, completed
  feedback: { type: String },
});

module.exports = mongoose.model("Booking", bookingSchema);
