const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Category: { type: String, enum: ['Bug', 'Task', 'Subtask'], required: true },
  Status: { type: String, enum: ['Assigned', 'Closed', 'Deferred', 'Duplicate', 'Fixed', 'Invalid', 'New', 'Open', 'Reopen', 'Retest', 'Verified'], required: true },
  Priority: { type: String, enum: ['Show stopper', 'High', 'Medium', 'Low'], required: true },
  StartDate: { type: Date },
  EndDate: { type: Date },
  IssueType: { type: String, enum: ['Not Applicable', 'UI/Design', 'Performance', 'Validations', 'Functionality', 'SEO', 'Console Error', 'Server Error', 'Tracking'] },
  Severity: { type: String, enum: ['Critical', 'Blocker', 'Major', 'Minor', 'Trivial'] },
  Environment: { type: String, enum: ['QA', 'Staging', 'Development', 'Production', 'UAT'] },
  Description: { type: String },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  AssignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  TestRunID: { type: mongoose.Schema.Types.ObjectId, ref: 'TestRun' }
});

// Custom validation for EndDate > StartDate
issueSchema.pre('save', function(next) {
  if (this.EndDate <= this.StartDate) {
    const err = new Error('EndDate must be greater than StartDate');
    next(err);
  } else {
    next();
  }
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
