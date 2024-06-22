const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Gender: { type: String },
  BirthYear: { type: Number },
  Phone: { type: String },
  UserImg: { type: String, default: 'DefaultPhoto.png' },
  LastLogin: { type: Date },
  Language: { type: String },
  Designation: { type: String },
  Locale: { type: String },
  Timezone: { type: String },
  IsAdmin: { type: Boolean, default: false },
  Status: { type: String, enum: ['Active', 'Inactive'] },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  AccountEmail: { type: String, ref: 'Account', required: true },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;