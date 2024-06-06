const fs = require('fs');
const path = require('path');
const TestCase = require('../models/testCaseModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const testCaseDataPath = path.join(__dirname, '..', 'data', 'testCases.json');

async function seedTestCases() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(testCaseDataPath);
    const testCaseData = JSON.parse(rawData);

    await TestCase.deleteMany({});
    await TestCase.insertMany(testCaseData);

    console.log('Dữ liệu mẫu cho bảng "TestCase" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "TestCase":', error);
  }
}

module.exports = seedTestCases;
