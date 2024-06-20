const mongoose = require('mongoose');

const requirementSchema = new mongoose.Schema({
  Type: { type: String, required: true },
  Description: { type: String },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  ReleaseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Release', required: true },
  AssignTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Requirement = mongoose.model('Requirement', requirementSchema);

module.exports = Requirement;
