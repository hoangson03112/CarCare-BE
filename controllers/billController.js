const Bill = require('../models/Bill');

// Lấy tất cả hóa đơn
exports.getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find().lean();
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách hóa đơn', error });
    }
};

// Tạo hóa đơn mới
exports.createBill = async (req, res) => {
    try {
        const newBill = new Bill(req.body);
        const savedBill = await newBill.save();
        res.status(201).json(savedBill);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo hóa đơn', error });
    }
};

// Cập nhật hóa đơn
exports.updateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBill = await Bill.findByIdAndUpdate(id, req.body, { new: true });
        
        if (!updatedBill) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        }
        
        res.status(200).json(updatedBill);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật hóa đơn', error });
    }
};

// Lấy chi tiết hóa đơn theo ID
exports.getBillById = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Bill.findById(id).lean();
        
        if (!bill) {
            return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
        }
        
        res.status(200).json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết hóa đơn', error });
    }
};