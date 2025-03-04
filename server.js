const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const route = require("./routes");
const authRoutes = require("./routes/auth");
const garageRouter = require("./routes/garageRoutes");
const appointment = require("./routes/appointments");
const garaManager = require("./routes/GaraManager");

const app = express();

app.use(cors());
app.use(express.json());
route(app);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api", garageRouter);
app.use("/appointment", appointment);
app.use("/garaManager", garaManager);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
