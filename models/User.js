const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "garage_owner"], required: true },
  vehicles: [
    {
      licensePlate: String,
      brand: String,
      model: String,
      year: Number,
    },
  ],
  garage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Garage",
    required: function () {
      return this.role === "garage_owner";
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
