const fs = require('fs');
const path = require('path');
const Tag = require('../models/tagModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const tagDataPath = path.join(__dirname, '..', 'data', 'tags.json');

async function seedTags() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(tagDataPath);
    const tagData = JSON.parse(rawData);

    await Tag.deleteMany({});
    await Tag.insertMany(tagData);

    console.log('Dữ liệu mẫu cho bảng "Tag" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Tag":', error);
  }
}

module.exports = seedTags;
