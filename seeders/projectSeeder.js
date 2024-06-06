const fs = require('fs');
const mongoose = require('mongoose');
const Project = require('../models/projectModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const projectDataPath = './data/projects.json';

async function seedProjects() {
try {
// Đọc dữ liệu từ file JSON
const rawData = fs.readFileSync(projectDataPath);
const projectData = JSON.parse(rawData);

await Project.deleteMany({});
await Project.insertMany(projectData);

console.log('Dữ liệu mẫu cho bảng "Project" đã được tạo thành công.');
// mongoose.connection.close();
} catch (error) {
console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Project":', error);
}
}

module.exports = seedProjects;