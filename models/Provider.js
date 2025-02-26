const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
});

module.exports = mongoose.model("Provider", providerSchema);
