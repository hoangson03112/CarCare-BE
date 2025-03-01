const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
    garageId: { type: Schema.Types.ObjectId, ref: 'Garage', required: true },
    date: { type: String, required: true },
    timeSlots: [{
        slot: { type: String, required: true },
        status: { type: String, enum: ['Available', 'Booked'], required: true },
        bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', default: null }
    }],
}, { timestamps: true });

module.exports = mongoose.model('Schedule', ScheduleSchema)