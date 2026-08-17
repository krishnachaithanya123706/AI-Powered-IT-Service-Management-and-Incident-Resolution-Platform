const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  ticket_number: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'Infrastructure' },
  priority: { type: String, enum: ['P1', 'P2', 'P3', 'P4'], default: 'P3' },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' },
  assigned_team: { type: String, default: 'Tier-1 IT Desk' },
  reporter: { type: String, default: 'IT Operator' },
  impacted_service: { type: String, default: 'Enterprise Infrastructure' },
  ai_suggested_resolution: { type: String, default: '' },
  ai_confidence: { type: Number, default: 90 },
  sla_deadline: { type: String, default: '' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Map MongoDB _id to virtual id string for frontend compatibility
incidentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Incident', incidentSchema);
