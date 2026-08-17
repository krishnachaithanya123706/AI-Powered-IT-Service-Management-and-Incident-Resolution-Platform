const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: String, default: 'System Agent' },
  details: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

activityLogSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
