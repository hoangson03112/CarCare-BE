
const bookingRoutes = require('./bookingRoutes');
// const auth = require('./auth');
const statisticRoutes = require('./statisticRoutes')
const scheduleRoutes = require('./scheduleRoutes')
function route(app) {


app.use('/booking', bookingRoutes);

app.use('/statistics', statisticRoutes);

app.use('/schedule', scheduleRoutes);


// app.use('/auth', auth);

}
module.exports= route