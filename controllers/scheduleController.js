const Schedule = require('../models/Schedule');

// 📌 Lấy lịch theo garageId và ngày (hiển thị slot trống và đã đặt)
exports.getScheduleByGarage = async (req, res) => {
    try {
        const { garageId } = req.params;
        const { date } = req.query; // Ngày cần lấy lịch

        if (!date) {
            return res.status(400).json({ message: 'Vui lòng cung cấp ngày' });
        }

        const schedule = await Schedule.findOne({ garageId, date }).populate('timeSlots.bookingId');

        if (!schedule) {
            return res.status(404).json({ message: 'Không tìm thấy lịch' });
        }

        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy lịch', error });
    }
};

// 📌 Cập nhật trạng thái của slot khi đặt lịch hoặc hủy lịch
exports.updateScheduleSlot = async (req, res) => {
    try {
        const { garageId } = req.params;
        const { date, slot } = req.body;
        const { status, bookingId } = req.body;

        const schedule = await Schedule.findOne({ garageId, date });
        if (!schedule) {
            return res.status(404).json({ message: 'Không tìm thấy lịch' });
        }

        const slotIndex = schedule.timeSlots.findIndex((s) => s.slot === slot);
        if (slotIndex === -1) {
            return res.status(400).json({ message: 'Không tìm thấy slot này' });
        }

        schedule.timeSlots[slotIndex].status = status;
        schedule.timeSlots[slotIndex].bookingId = status === 'Booked' ? bookingId : null;

        await schedule.save();
        res.status(200).json({ message: 'Cập nhật lịch thành công', schedule });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật lịch', error });
    }
};
