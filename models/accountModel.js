const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  Email: { type: String, required: true, unique: true },
  Password: { type: String, required: true },
  IsVerified: { type: Boolean, required: true, default: false },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
});

const AccountModel = mongoose.model('Account', accountSchema);

module.exports = AccountModel;