const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema({
  Role: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ProjectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
});

const Participation = mongoose.model('Participation', participationSchema);

module.exports = Participation;
