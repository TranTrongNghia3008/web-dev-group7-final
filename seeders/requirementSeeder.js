const fs = require('fs');
const path = require('path');
const Requirement = require('../models/requirementModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const requirementDataPath = path.join(__dirname, '..', 'data', 'requirements.json');

async function seedRequirements() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(requirementDataPath);
    const requirementData = JSON.parse(rawData);

    // await Requirement.deleteMany({});
    await Requirement.insertMany(requirementData);

    console.log('Dữ liệu mẫu cho bảng "Requirement" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Requirement":', error);
  }
}

module.exports = seedRequirements;
