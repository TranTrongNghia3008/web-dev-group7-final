const fs = require('fs');
const path = require('path');
const TestRun = require('../models/testRunModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const testRunDataPath = path.join(__dirname, '..', 'data', 'testRuns.json');

async function seedTestRuns() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(testRunDataPath);
    const testRunData = JSON.parse(rawData);

    await TestRun.deleteMany({});
    await TestRun.insertMany(testRunData);

    console.log('Dữ liệu mẫu cho bảng "TestRun" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "TestRun":', error);
  }
}

module.exports = seedTestRuns;
