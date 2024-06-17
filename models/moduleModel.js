const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
  Order: { type: Number, required: true },
  ParentID: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
  ProjectID: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
});


const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
