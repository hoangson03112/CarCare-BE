const mongoose = require('mongoose');
const { Schema } = mongoose;

const ServiceSchema = new Schema({
    name: { type: String, required: true, unique: true }, // Tên dịch vụ (VD: Rửa xe, Thay dầu phanh)
    description: { type: String }, // Mô tả dịch vụ
    price: { type: Number, required: true }, // Giá dịch vụ
    duration: { type: Number, required: true }, // Thời gian thực hiện (tính bằng phút)
    category: { type: String, enum: ['Sửa chữa', 'Bảo dưỡng'], required: true }, // Loại dịch vụ
    status: { type: String, enum: ['Hoạt động', 'Tạm ngừng'], default: 'Hoạt động' } // Trạng thái dịch vụ
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
