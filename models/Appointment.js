const mongoose = require("mongoose");
const AppointmentSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  garage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Garage",
    required: true,
  },
  vehicle: {
    licensePlate: String,
    brand: String,
    model: String,
    year: Number,
  },
  service: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  reason: { type: String, default: null }, // Thêm lý do hủy lịch hẹn
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Appointment", AppointmentSchema);
