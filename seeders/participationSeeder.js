const fs = require('fs');
const path = require('path');
const Participation = require('../models/participationModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const participationDataPath = path.join(__dirname, '..', 'data', 'participations.json');

async function seedParticipations() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(participationDataPath);
    const participationData = JSON.parse(rawData);

    // await Participation.deleteMany({});
    await Participation.insertMany(participationData);

    console.log('Dữ liệu mẫu cho bảng "Participation" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Participation":', error);
  }
}

module.exports = seedParticipations;
