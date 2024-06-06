const fs = require('fs');
const path = require('path');
const TestPlan = require('../models/testPlanModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const testPlanDataPath = path.join(__dirname, '..', 'data', 'testPlans.json');

async function seedTestPlans() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(testPlanDataPath);
    const testPlanData = JSON.parse(rawData);

    await TestPlan.deleteMany({});
    await TestPlan.insertMany(testPlanData);

    console.log('Dữ liệu mẫu cho bảng "TestPlan" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "TestPlan":', error);
  }
}

module.exports = seedTestPlans;
