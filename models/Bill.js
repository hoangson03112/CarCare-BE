const mongoose = require('mongoose');
const { Schema } = mongoose;

const BillSchema = new Schema({
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, required: true },
    services: [{
        serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
    }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
    paymentMethod: { type: String },
    paymentDate: { type: Date },
    garageId: { type: Schema.Types.ObjectId, ref: 'Garage', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Bill', BillSchema);