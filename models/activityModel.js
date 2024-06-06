const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Action: { type: String },
  ActivityDate: { type: Date, required: true },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  ModuleID: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  UserName: { type: String, required: true },
  UserMail: { type: String, ref: 'Account' }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
