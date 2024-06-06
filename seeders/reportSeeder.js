const fs = require('fs');
const path = require('path');
const Report = require('../models/reportModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const reportDataPath = path.join(__dirname, '..', 'data', 'reports.json');

async function seedReports() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(reportDataPath);
    const reportData = JSON.parse(rawData);

    // await Report.deleteMany({});
    await Report.insertMany(reportData);

    console.log('Dữ liệu mẫu cho bảng "Report" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Report":', error);
  }
}

module.exports = seedReports;
