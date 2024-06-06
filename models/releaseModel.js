const mongoose = require('mongoose');

const releaseSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Description: { type: String },
  StartDate: { type: Date },
  EndDate: { type: Date },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  ProjectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});

// Custom validation for EndDate > StartDate
releaseSchema.pre('save', function(next) {
  if (this.EndDate <= this.StartDate) {
    const err = new Error('EndDate must be greater than StartDate');
    next(err);
  } else {
    next();
  }
});

const Release = mongoose.model('Release', releaseSchema);

module.exports = Release;
