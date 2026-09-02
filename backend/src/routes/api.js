const express = require('express');
const router = express.Router();

const IncidentModel = require('../models/Incident');
const AssetModel = require('../models/Asset');
const ServiceRequestModel = require('../models/ServiceRequest');
const ChangeRequestModel = require('../models/ChangeRequest');
const ActivityLogModel = require('../models/ActivityLog');
const KnowledgeBaseModel = require('../models/KnowledgeBase');
const memoryStore = require('../db/memoryStore');

const { analyzeIncident, processCopilotChat } = require('../services/aiEngine');

function getModel(modelName) {
  if (memoryStore.isMemoryMode) {
    return memoryStore[modelName];
  }
  switch (modelName) {
    case 'Incident': return IncidentModel;
    case 'Asset': return AssetModel;
    case 'ServiceRequest': return ServiceRequestModel;
    case 'ChangeRequest': return ChangeRequestModel;
    case 'ActivityLog': return ActivityLogModel;
    case 'KnowledgeBase': return KnowledgeBaseModel;
    default: return IncidentModel;
  }
}

// -------------------------------------------------------------
// 1. INCIDENTS API
// -------------------------------------------------------------

router.get('/incidents', async (req, res) => {
  try {
    const Incident = getModel('Incident');
    const { status, priority, category } = req.query;
    let query = {};

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (category && category !== 'All') query.category = category;

    const incidents = await Incident.find(query).sort({ created_at: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/incidents/:id', async (req, res) => {
  try {
    const Incident = getModel('Incident');
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/incidents', async (req, res) => {
  try {
    const Incident = getModel('Incident');
    const ActivityLog = getModel('ActivityLog');
    const { title, description, category, reporter, impacted_service } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const count = await Incident.countDocuments();
    const ticketNumber = `INC-${1001 + count}`;

    const aiResult = analyzeIncident(title, description, category, impacted_service);

    const newIncident = await Incident.create({
      ticket_number: ticketNumber,
      title,
      description: description || '',
      category: category || aiResult.category,
      priority: aiResult.priority,
      status: 'Open',
      assigned_team: aiResult.assignedTeam,
      reporter: reporter || 'IT Operator',
      impacted_service: impacted_service || 'Enterprise Infrastructure',
      ai_suggested_resolution: aiResult.aiSuggestedResolution,
      ai_confidence: aiResult.aiConfidence,
      sla_deadline: aiResult.slaDeadline
    });

    await ActivityLog.create({
      action: 'INCIDENT_CREATED',
      user: reporter || 'IT Operator',
      details: `Created ticket ${ticketNumber} [${aiResult.priority}] for ${title}`
    });

    res.status(201).json(newIncident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/incidents/:id', async (req, res) => {
  try {
    const Incident = getModel('Incident');
    const ActivityLog = getModel('ActivityLog');
    const updated = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Incident not found' });

    await ActivityLog.create({
      action: 'INCIDENT_UPDATED',
      user: 'IT Engineer',
      details: `Updated incident ${updated.ticket_number || req.params.id}`
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/incidents/:id', async (req, res) => {
  try {
    const Incident = getModel('Incident');
    const ActivityLog = getModel('ActivityLog');
    const deleted = await Incident.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Incident not found' });

    await ActivityLog.create({
      action: 'INCIDENT_DELETED',
      user: 'IT Engineer',
      details: `Deleted ticket ${deleted.ticket_number} - ${deleted.title}`
    });

    res.json({ message: 'Incident deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/incidents/:id/ai-resolve', async (req, res) => {
  try {
    const Incident = getModel('Incident');
    const ActivityLog = getModel('ActivityLog');
    const updated = await Incident.findByIdAndUpdate(
      req.params.id,
      { status: 'Resolved' },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Incident not found' });

    await ActivityLog.create({
      action: 'AI_RESOLUTION_EXECUTED',
      user: 'AI Copilot Engine',
      details: `Applied automated resolution playbook to ticket #${updated.ticket_number}`
    });

    res.json({ message: 'Incident resolved using AI recommendation', incident: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 2. INFRASTRUCTURE & ASSETS API
// -------------------------------------------------------------

router.get('/assets', async (req, res) => {
  try {
    const Asset = getModel('Asset');
    const assets = await Asset.find().sort({ _id: 1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/assets/:id', async (req, res) => {
  try {
    const Asset = getModel('Asset');
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/assets', async (req, res) => {
  try {
    const Asset = getModel('Asset');
    const ActivityLog = getModel('ActivityLog');
    const { name, type, environment, ip_address, status, cpu_usage, memory_usage } = req.body;

    if (!name) return res.status(400).json({ error: 'Asset name is required' });

    const count = await Asset.countDocuments();
    const assetTag = `AST-${10 + count + 1}`;

    const newAsset = await Asset.create({
      asset_tag: assetTag,
      name,
      type: type || 'Kubernetes Cluster',
      environment: environment || 'Production',
      status: status || 'Healthy',
      ip_address: ip_address || '10.0.0.1',
      cpu_usage: cpu_usage || 20,
      memory_usage: memory_usage || 35
    });

    await ActivityLog.create({
      action: 'ASSET_CREATED',
      user: 'SysAdmin',
      details: `Added new IT asset ${name} (${assetTag})`
    });

    res.status(201).json(newAsset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/assets/:id', async (req, res) => {
  try {
    const Asset = getModel('Asset');
    const ActivityLog = getModel('ActivityLog');
    const updated = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Asset not found' });

    await ActivityLog.create({
      action: 'ASSET_UPDATED',
      user: 'SysAdmin',
      details: `Updated asset ${updated.asset_tag}`
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/assets/:id', async (req, res) => {
  try {
    const Asset = getModel('Asset');
    const ActivityLog = getModel('ActivityLog');
    const deleted = await Asset.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Asset not found' });

    await ActivityLog.create({
      action: 'ASSET_DELETED',
      user: 'SysAdmin',
      details: `Deleted asset ${deleted.name} (${deleted.asset_tag})`
    });

    res.json({ message: 'Asset deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/assets/simulate-alert', async (req, res) => {
  try {
    const Asset = getModel('Asset');
    const Incident = getModel('Incident');
    const ActivityLog = getModel('ActivityLog');

    const { assetId } = req.body;
    let asset = assetId ? await Asset.findById(assetId) : await Asset.findOne();

    if (!asset) return res.status(404).json({ error: 'Asset not found' });

    asset.status = 'Critical';
    asset.cpu_usage = 99;
    asset.memory_usage = 98;
    if (asset.save) await asset.save();
    else await Asset.findByIdAndUpdate(asset._id || asset.id, asset);

    const count = await Incident.countDocuments();
    const ticketNumber = `INC-${1001 + count}`;
    const title = `CRITICAL ALERT: Node ${asset.name} High Resource Exhaustion & Packet Loss`;
    const description = `Automated telemetry system triggered P1 alert for node ${asset.name} (${asset.ip_address}). CPU at 99%, Memory at 98%.`;

    const aiResult = analyzeIncident(title, description, 'Infrastructure', asset.name);

    await Incident.create({
      ticket_number: ticketNumber,
      title,
      description,
      category: 'Infrastructure',
      priority: 'P1',
      status: 'Open',
      assigned_team: aiResult.assignedTeam,
      reporter: 'Infrastructure Telemetry Agent',
      impacted_service: asset.name,
      ai_suggested_resolution: aiResult.aiSuggestedResolution,
      ai_confidence: 96,
      sla_deadline: aiResult.slaDeadline
    });

    await ActivityLog.create({
      action: 'SYSTEM_ALERT_TRIGGERED',
      user: 'Monitoring System',
      details: `Simulated failure alert on ${asset.name}. Auto-created ${ticketNumber}`
    });

    res.json({
      message: `Infrastructure alert simulated for asset ${asset.name}! Auto-created incident ${ticketNumber}`,
      assetId: asset._id || asset.id,
      ticketNumber
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 3. SERVICE REQUESTS CATALOG API
// -------------------------------------------------------------

router.get('/service-requests', async (req, res) => {
  try {
    const ServiceRequest = getModel('ServiceRequest');
    const requests = await ServiceRequest.find().sort({ created_at: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/service-requests/:id', async (req, res) => {
  try {
    const ServiceRequest = getModel('ServiceRequest');
    const requestItem = await ServiceRequest.findById(req.params.id);
    if (!requestItem) return res.status(404).json({ error: 'Service request not found' });
    res.json(requestItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/service-requests', async (req, res) => {
  try {
    const ServiceRequest = getModel('ServiceRequest');
    const ActivityLog = getModel('ActivityLog');
    const { title, category, requested_by, urgency } = req.body;

    if (!title) return res.status(400).json({ error: 'Title required' });

    const count = await ServiceRequest.countDocuments();
    const requestNumber = `REQ-${5001 + count}`;

    const newReq = await ServiceRequest.create({
      request_number: requestNumber,
      title,
      category: category || 'General Service',
      requested_by: requested_by || 'Employee User',
      urgency: urgency || 'Medium',
      approval_status: 'Pending Approval',
      status: 'Submitted'
    });

    await ActivityLog.create({
      action: 'SERVICE_REQ_CREATED',
      user: requested_by || 'Employee User',
      details: `Submitted Service Request ${requestNumber}: ${title}`
    });

    res.status(201).json(newReq);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/service-requests/:id', async (req, res) => {
  try {
    const ServiceRequest = getModel('ServiceRequest');
    const ActivityLog = getModel('ActivityLog');
    const updated = await ServiceRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Service request not found' });

    await ActivityLog.create({
      action: 'SERVICE_REQ_UPDATED',
      user: 'Service Desk',
      details: `Updated Service Request ${updated.request_number}`
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/service-requests/:id', async (req, res) => {
  try {
    const ServiceRequest = getModel('ServiceRequest');
    const ActivityLog = getModel('ActivityLog');
    const deleted = await ServiceRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Service request not found' });

    await ActivityLog.create({
      action: 'SERVICE_REQ_DELETED',
      user: 'Service Desk',
      details: `Deleted Service Request ${deleted.request_number}`
    });

    res.json({ message: 'Service request deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 4. CHANGE MANAGEMENT API
// -------------------------------------------------------------

router.get('/change-requests', async (req, res) => {
  try {
    const ChangeRequest = getModel('ChangeRequest');
    const changes = await ChangeRequest.find().sort({ created_at: -1 });
    res.json(changes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/change-requests/:id', async (req, res) => {
  try {
    const ChangeRequest = getModel('ChangeRequest');
    const changeItem = await ChangeRequest.findById(req.params.id);
    if (!changeItem) return res.status(404).json({ error: 'Change request not found' });
    res.json(changeItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/change-requests', async (req, res) => {
  try {
    const ChangeRequest = getModel('ChangeRequest');
    const ActivityLog = getModel('ActivityLog');
    const { title, risk_level, implementation_date, assigned_lead } = req.body;

    if (!title) return res.status(400).json({ error: 'Title is required' });

    const count = await ChangeRequest.countDocuments();
    const changeNumber = `CHG-${2001 + count}`;

    const newChange = await ChangeRequest.create({
      change_number: changeNumber,
      title,
      risk_level: risk_level || 'Medium',
      cab_approval: 'Pending Review',
      implementation_date: implementation_date || new Date().toISOString().split('T')[0],
      assigned_lead: assigned_lead || 'Lead Systems Architect',
      status: 'Planning'
    });

    await ActivityLog.create({
      action: 'CHANGE_REQ_CREATED',
      user: assigned_lead || 'Lead Systems Architect',
      details: `Submitted RFC ${changeNumber}: ${title}`
    });

    res.status(201).json(newChange);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/change-requests/:id', async (req, res) => {
  try {
    const ChangeRequest = getModel('ChangeRequest');
    const ActivityLog = getModel('ActivityLog');
    const updated = await ChangeRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Change request not found' });

    await ActivityLog.create({
      action: 'CHANGE_REQ_UPDATED',
      user: 'CAB Board',
      details: `Updated Change Request ${updated.change_number}`
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/change-requests/:id', async (req, res) => {
  try {
    const ChangeRequest = getModel('ChangeRequest');
    const ActivityLog = getModel('ActivityLog');
    const deleted = await ChangeRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Change request not found' });

    await ActivityLog.create({
      action: 'CHANGE_REQ_DELETED',
      user: 'CAB Board',
      details: `Deleted Change Request ${deleted.change_number}`
    });

    res.json({ message: 'Change request deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 5. EXECUTIVE METRICS & DASHBOARD API
// -------------------------------------------------------------

router.get('/metrics', async (req, res) => {
  try {
    const Incident = getModel('Incident');
    const Asset = getModel('Asset');
    const incidents = await Incident.find();
    const assets = await Asset.find();

    const activeIncidents = incidents.filter(r => r.status === 'Open' || r.status === 'In Progress').length;
    const p1Incidents = incidents.filter(r => r.priority === 'P1' && r.status !== 'Resolved' && r.status !== 'Closed').length;
    const resolvedIncidents = incidents.filter(r => r.status === 'Resolved' || r.status === 'Closed').length;
    const healthyAssets = assets.filter(a => a.status === 'Healthy').length;
    const infrastructureHealthScore = assets.length > 0 ? Number(((healthyAssets / assets.length) * 100).toFixed(1)) : 100;

    res.json({
      totalIncidents: incidents.length,
      activeIncidents,
      p1Incidents,
      resolvedIncidents,
      slaComplianceRate: 96.4,
      meanTimeToResolveMinutes: 38,
      infrastructureHealthScore,
      activeAssetsCount: assets.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 6. AI COPILOT CHAT API
// -------------------------------------------------------------

router.post('/copilot/chat', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  const aiResponse = processCopilotChat(prompt);
  res.json(aiResponse);
});

// -------------------------------------------------------------
// 7. ACTIVITY AUDIT LOGS API
// -------------------------------------------------------------

router.get('/activity-logs', async (req, res) => {
  try {
    const ActivityLog = getModel('ActivityLog');
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(25);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 8. KNOWLEDGE BASE & RUNBOOKS API (FEATURE 1)
// -------------------------------------------------------------

router.get('/knowledge-base', async (req, res) => {
  try {
    const KnowledgeBase = getModel('KnowledgeBase');
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { problem_summary: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    const articles = await KnowledgeBase.find(query).sort({ created_at: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/knowledge-base/:id', async (req, res) => {
  try {
    const KnowledgeBase = getModel('KnowledgeBase');
    const article = await KnowledgeBase.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    article.view_count = (article.view_count || 0) + 1;
    if (article.save) await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/knowledge-base', async (req, res) => {
  try {
    const KnowledgeBase = getModel('KnowledgeBase');
    const ActivityLog = getModel('ActivityLog');
    const { title, category, tags, problem_summary, resolution_steps, author } = req.body;
    if (!title || !problem_summary) {
      return res.status(400).json({ error: 'Title and problem summary are required' });
    }

    const count = await KnowledgeBase.countDocuments();
    const kbId = `KB-${8001 + count}`;

    const newArticle = await KnowledgeBase.create({
      kb_id: kbId,
      title,
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      problem_summary,
      resolution_steps: Array.isArray(resolution_steps) ? resolution_steps : (resolution_steps ? resolution_steps.split('\n').filter(Boolean) : []),
      author: author || 'IT Operations Specialist'
    });

    await ActivityLog.create({
      action: 'KB_ARTICLE_CREATED',
      user: author || 'IT Operations Specialist',
      details: `Published Knowledge Base article ${kbId}: ${title}`
    });

    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/knowledge-base/:id', async (req, res) => {
  try {
    const KnowledgeBase = getModel('KnowledgeBase');
    const ActivityLog = getModel('ActivityLog');
    const deleted = await KnowledgeBase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Article not found' });

    await ActivityLog.create({
      action: 'KB_ARTICLE_DELETED',
      user: 'IT Admin',
      details: `Deleted KB article ${deleted.kb_id} - ${deleted.title}`
    });

    res.json({ message: 'KB Article deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// 9. ADVANCED ITSM ANALYTICS API (FEATURE 2)
// -------------------------------------------------------------

router.get('/analytics', async (req, res) => {
  try {
    const Incident = getModel('Incident');
    const Asset = getModel('Asset');
    const ServiceRequest = getModel('ServiceRequest');
    const ChangeRequest = getModel('ChangeRequest');
    const KnowledgeBase = getModel('KnowledgeBase');

    const incidents = await Incident.find();
    const assets = await Asset.find();
    const serviceReqs = await ServiceRequest.find();
    const changeReqs = await ChangeRequest.find();
    const kbArticles = await KnowledgeBase.find();

    const categoryCounts = {};
    incidents.forEach(inc => {
      categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
    });

    const priorityCounts = { P1: 0, P2: 0, P3: 0, P4: 0 };
    incidents.forEach(inc => {
      if (priorityCounts[inc.priority] !== undefined) {
        priorityCounts[inc.priority]++;
      }
    });

    const teamCounts = {};
    incidents.forEach(inc => {
      const team = inc.assigned_team || 'Unassigned';
      teamCounts[team] = (teamCounts[team] || 0) + 1;
    });

    const assetStatusCounts = { Healthy: 0, Warning: 0, Critical: 0 };
    assets.forEach(ast => {
      if (assetStatusCounts[ast.status] !== undefined) {
        assetStatusCounts[ast.status]++;
      }
    });

    res.json({
      summary: {
        totalIncidents: incidents.length,
        openIncidents: incidents.filter(i => i.status === 'Open').length,
        inProgressIncidents: incidents.filter(i => i.status === 'In Progress').length,
        resolvedIncidents: incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length,
        totalAssets: assets.length,
        healthyAssets: assetStatusCounts.Healthy,
        totalServiceRequests: serviceReqs.length,
        pendingServiceRequests: serviceReqs.filter(s => s.status === 'Submitted' || s.approval_status === 'Pending Approval').length,
        totalChangeRequests: changeReqs.length,
        totalKbArticles: kbArticles.length,
        slaCompliancePercentage: 96.4,
        avgResolutionTimeMinutes: 38.5,
        mttrTargetMinutes: 45.0
      },
      categoryDistribution: Object.keys(categoryCounts).map(cat => ({ category: cat, count: categoryCounts[cat] })),
      priorityDistribution: Object.keys(priorityCounts).map(pri => ({ priority: pri, count: priorityCounts[pri] })),
      teamWorkload: Object.keys(teamCounts).map(t => ({ team: t, count: teamCounts[t] })),
      assetHealthBreakdown: assetStatusCounts,
      recentPerformanceTrends: [
        { day: 'Mon', incidentsLogged: 12, incidentsResolved: 11, mttrMinutes: 42 },
        { day: 'Tue', incidentsLogged: 18, incidentsResolved: 17, mttrMinutes: 36 },
        { day: 'Wed', incidentsLogged: 15, incidentsResolved: 14, mttrMinutes: 39 },
        { day: 'Thu', incidentsLogged: 22, incidentsResolved: 20, mttrMinutes: 41 },
        { day: 'Fri', incidentsLogged: 9, incidentsResolved: 10, mttrMinutes: 32 },
        { day: 'Sat', incidentsLogged: 4, incidentsResolved: 4, mttrMinutes: 25 },
        { day: 'Sun', incidentsLogged: 6, incidentsResolved: 6, mttrMinutes: 28 }
      ]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
