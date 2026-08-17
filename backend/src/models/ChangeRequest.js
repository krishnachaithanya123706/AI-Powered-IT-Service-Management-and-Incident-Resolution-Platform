const mongoose = require('mongoose');

const changeRequestSchema = new mongoose.Schema({
  change_number: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  risk_level: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  cab_approval: { type: String, enum: ['Pending Review', 'Approved', 'Rejected'], default: 'Pending Review' },
  implementation_date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  assigned_lead: { type: String, default: 'Lead Systems Architect' },
  status: { type: String, enum: ['Planning', 'In Review', 'Scheduled', 'Completed', 'Rolled Back'], default: 'Planning' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

changeRequestSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('ChangeRequest', changeRequestSchema);
