const mongoose = require('mongoose');

const testRunSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Description: { type: String },
  Status: { type: String, enum: ['Passed', 'Untested', 'Blocked', 'Retest', 'Failed', 'Not Applicable', 'In Progress', 'Hold'] },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  AssignTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  TestCaseID: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCase', required: true }
});

const TestRun = mongoose.model('TestRun', testRunSchema);

module.exports = TestRun;
