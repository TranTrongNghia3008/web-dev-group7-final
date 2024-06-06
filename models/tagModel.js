const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  TestCaseID: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCase', required: true }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
