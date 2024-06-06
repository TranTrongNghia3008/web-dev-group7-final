const fs = require('fs');
const path = require('path');
const Issue = require('../models/issueModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const issueDataPath = path.join(__dirname, '..', 'data', 'issues.json');

async function seedIssues() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(issueDataPath);
    const issueData = JSON.parse(rawData);

    await Issue.deleteMany({});
    await Issue.insertMany(issueData);

    console.log('Dữ liệu mẫu cho bảng "Issue" đã được tạo thành công.');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Issue":', error);
  }
}

module.exports = seedIssues;
