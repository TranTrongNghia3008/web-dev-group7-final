const fs = require('fs');
const path = require('path');
const Release = require('../models/releaseModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const releaseDataPath = path.join(__dirname, '..', 'data', 'releases.json');

async function seedReleases() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(releaseDataPath);
    const releaseData = JSON.parse(rawData);

    // await Release.deleteMany({});
    await Release.insertMany(releaseData);

    console.log('Dữ liệu mẫu cho bảng "Release" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Release":', error);
  }
}

module.exports = seedReleases;
