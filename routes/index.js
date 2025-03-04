const bookingRoutes = require("./bookingRoutes");
// const auth = require('./auth');
const statisticRoutes = require("./statisticRoutes");
const scheduleRoutes = require("./scheduleRoutes");

const serviceRoutes = require("./serviceRoutes");

const billRoutes = require("./billRoutes");
function route(app) {
  app.use("/booking", bookingRoutes);

  app.use("/statistics", statisticRoutes);

  app.use("/schedule", scheduleRoutes);

  app.use("/bill", billRoutes);

  app.use("/service", serviceRoutes);

  // app.use('/auth', auth);
}
module.exports = route;
