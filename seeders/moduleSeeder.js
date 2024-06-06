const fs = require('fs');
const path = require('path');
const Module = require('../models/moduleModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const moduleDataPath = path.join(__dirname, '..', 'data', 'modules.json');

async function seedModules() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(moduleDataPath);
    const moduleData = JSON.parse(rawData);

    // await Module.deleteMany({});
    await Module.insertMany(moduleData);

    console.log('Dữ liệu mẫu cho bảng "Module" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Module":', error);
  }
}

module.exports = seedModules;
