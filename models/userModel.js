const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Gender: { type: String, required: true },
  BirthYear: { type: Number, required: true },
  Phone: { type: String },
  UserImg: { type: String, default: 'default-user-image.png' },
  LastLogin: { type: Date },
  IsAdmin: { type: Boolean, default: false },
  Status: { type: String, enum: ['Active', 'Inactive'] },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  AccountEmail: { type: String, ref: 'Account', required: true },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;