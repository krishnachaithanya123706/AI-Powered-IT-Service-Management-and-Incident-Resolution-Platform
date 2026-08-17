const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  request_number: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General Service' },
  requested_by: { type: String, default: 'Employee User' },
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  approval_status: { type: String, enum: ['Pending Approval', 'Approved', 'Rejected'], default: 'Pending Approval' },
  status: { type: String, enum: ['Submitted', 'In Fulfillment', 'Fulfilled', 'Cancelled'], default: 'Submitted' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

serviceRequestSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
