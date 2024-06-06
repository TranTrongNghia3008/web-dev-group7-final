const fs = require('fs');
const path = require('path');
const Activity = require('../models/activityModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const activityDataPath = path.join(__dirname, '..', 'data', 'activities.json');

async function seedActivities() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(activityDataPath);
    const activityData = JSON.parse(rawData);

    await Activity.deleteMany({});
    await Activity.insertMany(activityData);

    console.log('Dữ liệu mẫu cho bảng "Activity" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Activity":', error);
  }
}

module.exports = seedActivities;
