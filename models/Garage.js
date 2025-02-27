const GarageSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  services: [
    {
      name: String,
      price: Number,
    },
  ],
  workingHours: {
    open: String,
    close: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Garage", GarageSchema);
