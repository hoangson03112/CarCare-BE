const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const db = require('./config/mongodb');


const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/bookings");

const app = express();

db.connect();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
