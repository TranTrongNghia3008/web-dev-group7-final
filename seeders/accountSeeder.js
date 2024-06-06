const fs = require('fs');
const mongoose = require('mongoose');
const Account = require('../models/accountModel');

// Đường dẫn đến file JSON chứa dữ liệu mẫu
const accountDataPath = './data/accounts.json';

async function seedAccounts() {
  try {
    // Đọc dữ liệu từ file JSON
    const rawData = fs.readFileSync(accountDataPath);
    const accountData = JSON.parse(rawData);

    await Account.deleteMany({});
    await Account.insertMany(accountData);

    console.log('Dữ liệu mẫu cho bảng "Account" đã được tạo thành công.');
    // mongoose.connection.close();
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu cho bảng "Account":', error);
  }
}
module.exports = seedAccounts;
// seedAccounts();