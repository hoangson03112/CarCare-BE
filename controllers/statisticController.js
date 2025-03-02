const Statistic = require('../models/Statistic');
const mongoose = require('mongoose');
const statisticController = {
    // Lấy thống kê theo ngày cho một garageId
    async getStatisticsByDay(req, res) {
        try {
            const { garageId } = req.params;
            console.log('garageId:', garageId);
            
            const { date } = req.query; // format: YYYY-MM-DD
            console.log('date:', date);
            
            if (!date) {
                return res.status(400).json({ message: 'Vui lòng cung cấp ngày (YYYY-MM-DD)' });
            }
            
            // Tạo date một cách an toàn
            const [year, month, day] = date.split('-').map(num => parseInt(num));
            const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
            
            console.log('start date:', start);
            console.log('end date:', end);
            
            // Kiểm tra xem start và end có phải là Invalid Date không
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: 'Ngày tháng không hợp lệ' });
            }
            
            const testData = await Statistic.find({
                garageId: new mongoose.Types.ObjectId(garageId),
                createdAt: { $gte: start, $lte: end }
            });
            
            console.log('Test data:', testData);
            
            const statistics = await Statistic.aggregate([
                { 
                    $match: {  
                        garageId: new mongoose.Types.ObjectId(garageId),
                        createdAt: { $gte: start, $lte: end } 
                    } 
                },
                { 
                    $group: { 
                        _id: null,
                        totalCustomers: { $sum: '$totalCustomers' },
                        totalRevenue: { $sum: '$totalRevenue' }
                    }
                }
            ]);
            
            console.log('Aggregated statistics:', statistics);
            
            const responseData = statistics.length > 0 ? statistics[0] : { totalCustomers: 0, totalRevenue: 0, message: 'Không có dữ liệu' };
            console.log('Response data:', responseData);
            
            res.json(responseData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Lấy thống kê theo tháng cho một garageId
    async getStatisticsByMonth(req, res) {
        try {
            const { garageId } = req.params;
            console.log('garageId:', garageId);
    
            const { year, month } = req.query; // format: YYYY, MM
            console.log('year:', year, 'month:', month);
    
            if (!year || !month) {
                return res.status(400).json({ message: 'Vui lòng cung cấp năm và tháng (YYYY, MM)' });
            }
    
            // Đảm bảo month có 2 chữ số
            const paddedMonth = month.toString().padStart(2, '0');
            
            // Tạo date một cách an toàn
            const start = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1));
            const end = new Date(Date.UTC(parseInt(year), parseInt(month), 0, 23, 59, 59, 999));
            
            console.log('start date:', start);
            console.log('end date:', end);
    
            // Kiểm tra xem start và end có phải là Invalid Date không
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: 'Ngày tháng không hợp lệ' });
            }
    
            const testData = await Statistic.find({
                garageId: new mongoose.Types.ObjectId(garageId),
                createdAt: { $gte: start, $lt: end }
            });
            
            console.log('Test data:', testData);
            
            const statistics = await Statistic.aggregate([
                { 
                    $match: {  
                        garageId: new mongoose.Types.ObjectId(garageId),
                        createdAt: { $gte: start, $lt: end } 
                    } 
                },
                { 
                    $group: { 
                        _id: null,
                        totalCustomers: { $sum: '$totalCustomers' },
                        totalRevenue: { $sum: '$totalRevenue' }
                    }
                }
            ]);
    
            console.log('Aggregated statistics:', statistics);
    
            const responseData = statistics.length > 0 ? statistics[0] : { totalCustomers: 0, totalRevenue: 0, message: 'Không có dữ liệu' };
            console.log('Response data:', responseData);
    
            res.json(responseData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    },

    // Lấy thống kê theo năm cho một garageId
    async getStatisticsByYear(req, res) {
        try {
            const { garageId } = req.params;
            console.log('garageId:', garageId);
            
            const { year } = req.query; // format: YYYY
            console.log('year:', year);
            
            if (!year) {
                return res.status(400).json({ message: 'Vui lòng cung cấp năm (YYYY)' });
            }
            
            // Tạo date một cách an toàn
            const start = new Date(Date.UTC(parseInt(year), 0, 1, 0, 0, 0, 0));
            const end = new Date(Date.UTC(parseInt(year), 11, 31, 23, 59, 59, 999));
            
            console.log('start date:', start);
            console.log('end date:', end);
            
            // Kiểm tra xem start và end có phải là Invalid Date không
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: 'Năm không hợp lệ' });
            }
            
            const testData = await Statistic.find({
                garageId: new mongoose.Types.ObjectId(garageId),
                createdAt: { $gte: start, $lte: end }
            });
            
            console.log('Test data:', testData);
            
            const statistics = await Statistic.aggregate([
                { 
                    $match: {  
                        garageId: new mongoose.Types.ObjectId(garageId),
                        createdAt: { $gte: start, $lte: end } 
                    } 
                },
                { 
                    $group: { 
                        _id: null,
                        totalCustomers: { $sum: '$totalCustomers' },
                        totalRevenue: { $sum: '$totalRevenue' }
                    }
                }
            ]);
            
            console.log('Aggregated statistics:', statistics);
            
            const responseData = statistics.length > 0 ? statistics[0] : { totalCustomers: 0, totalRevenue: 0, message: 'Không có dữ liệu' };
            console.log('Response data:', responseData);
            
            res.json(responseData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }
};

module.exports = statisticController;