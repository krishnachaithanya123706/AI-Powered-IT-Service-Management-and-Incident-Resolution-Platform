const mongoose = require('mongoose');

const KnowledgeBaseSchema = new mongoose.Schema({
  kb_id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['Infrastructure', 'Database', 'Security', 'Network', 'General'], default: 'General' },
  tags: [{ type: String }],
  problem_summary: { type: String, required: true },
  resolution_steps: [{ type: String }],
  author: { type: String, default: 'Lead DevOps Architect' },
  view_count: { type: Number, default: 0 },
  rating: { type: Number, default: 4.8 },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
