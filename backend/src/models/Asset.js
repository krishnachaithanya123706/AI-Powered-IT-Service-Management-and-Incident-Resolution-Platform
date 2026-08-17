const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  asset_tag: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Kubernetes Cluster' },
  environment: { type: String, default: 'Production' },
  status: { type: String, enum: ['Healthy', 'Warning', 'Critical'], default: 'Healthy' },
  ip_address: { type: String, default: '10.0.0.1' },
  uptime_percent: { type: Number, default: 99.9 },
  cpu_usage: { type: Number, default: 20 },
  memory_usage: { type: Number, default: 35 },
  last_ping: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

assetSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

module.exports = mongoose.model('Asset', assetSchema);
