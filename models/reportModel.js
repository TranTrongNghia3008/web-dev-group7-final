const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Type: { type: String },
  StartDate: { type: Date },
  EndDate: { type: Date },
  IsScheduled: { type: Boolean, default: false },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  ProjectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});

// Custom validation for EndDate < StartDate
reportSchema.pre('save', function(next) {
  if (!this.EndDate){
    next();
  } 

  if (!this.StartDate){
    next();
  }

  if (this.EndDate < this.StartDate) {
    const err = new Error('EndDate must be greater than StartDate');
    next(err);
  } else {
    next();
  }
});

// Custom validation for EndDate < StartDate but when updating
reportSchema.pre('update', function(next) {
  if (!this.EndDate){
    next();
  } 

  if (!this.StartDate){
    next();
  }

  if (this.EndDate < this.StartDate) {
    const err = new Error('EndDate must be greater than StartDate');
    next(err);
  } else {
    next();
  }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
