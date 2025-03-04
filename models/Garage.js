const mongoose = require("mongoose");

const GarageSchema = new mongoose.Schema({

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10,11}$/, "Số điện thoại phải có 10-11 chữ số"],
  },
  services: [
    {
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    },
  ],
  workingHours: {
    open: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, "Định dạng giờ phải là HH:MM"],
    },
    close: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, "Định dạng giờ phải là HH:MM"],
      validate: {
        validator: function (value) {
          const openTime = this.workingHours.open.split(":").map(Number);
          const closeTime = value.split(":").map(Number);
          const openMinutes = openTime[0] * 60 + openTime[1];
          const closeMinutes = closeTime[0] * 60 + closeTime[1];
          return closeMinutes > openMinutes;
        },
        message: "Giờ đóng cửa phải sau giờ mở cửa",
      },
    },
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  rating: {
    average: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Garage", GarageSchema, "garages");
