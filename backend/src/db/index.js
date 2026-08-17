const mongoose = require('mongoose');

const Incident = require('../models/Incident');
const Asset = require('../models/Asset');
const ServiceRequest = require('../models/ServiceRequest');
const ChangeRequest = require('../models/ChangeRequest');
const ActivityLog = require('../models/ActivityLog');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/itsm_db';

const initDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`✅ Connected to MongoDB at ${MONGODB_URI}`);

    // Seed initial demo data if database collections are empty
    await seedDatabaseIfEmpty();
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
  }
};

async function seedDatabaseIfEmpty() {
  const incidentCount = await Incident.countDocuments();
  if (incidentCount > 0) return;

  console.log('Seeding initial enterprise ITSM demo dataset into MongoDB...');

  const now = new Date();
  const sla1 = new Date(now.getTime() + 1 * 3600 * 1000).toISOString();
  const sla2 = new Date(now.getTime() + 4 * 3600 * 1000).toISOString();
  const sla3 = new Date(now.getTime() + 12 * 3600 * 1000).toISOString();
  const sla4 = new Date(now.getTime() - 2 * 3600 * 1000).toISOString();

  // 1. Seed Incidents
  await Incident.insertMany([
    {
      ticket_number: 'INC-1001',
      title: 'Payment Gateway High Latency & 504 Gateway Timeouts',
      description: 'Spike in 504 HTTP timeout errors detected on US-East API ingress node. Transactions failing at rate of 14%.',
      category: 'Infrastructure',
      priority: 'P1',
      status: 'In Progress',
      assigned_team: 'DevOps & Site Reliability',
      reporter: 'Prometheus Alertmanager',
      impacted_service: 'Payment Processing API',
      ai_suggested_resolution: '1. Scale API Pod replicas from 8 to 20.\n2. Restart Redis Session Cluster connection pool.\n3. Flush bottlenecked connection queue.',
      ai_confidence: 94,
      sla_deadline: sla1
    },
    {
      ticket_number: 'INC-1002',
      title: 'PostgreSQL Core DB Master Connection Pool Exhaustion',
      description: 'Maximum client connection limit (500) reached. Active connections pending in queue.',
      category: 'Database',
      priority: 'P1',
      status: 'Open',
      assigned_team: 'Database Administrators',
      reporter: 'Data Platform Sentinel',
      impacted_service: 'Core Customer DB',
      ai_suggested_resolution: '1. Terminate orphaned sleeping connection threads.\n2. Increase max_connections to 800 dynamically.\n3. Verify PgBouncer connection pooling service.',
      ai_confidence: 91,
      sla_deadline: sla2
    },
    {
      ticket_number: 'INC-1003',
      title: 'Active Directory LDAP Sync Failure for EU Employees',
      description: 'Employees in EMEA region unable to authenticate to internal VPN and Jira SSO.',
      category: 'Security & Identity',
      priority: 'P2',
      status: 'In Progress',
      assigned_team: 'SecOps & IAM Team',
      reporter: 'Sarah Connor (EU IT Desk)',
      impacted_service: 'Global IAM Service',
      ai_suggested_resolution: '1. Restart Azure AD Connect Sync Service.\n2. Re-synchronize Kerberos ticket grant certificates.\n3. Verify port 389/636 firewall rules.',
      ai_confidence: 88,
      sla_deadline: sla3
    },
    {
      ticket_number: 'INC-1004',
      title: 'Kubernetes Ingress Controller SSL Certificate Expiration Warning',
      description: 'SSL Certificate for API gateway expiring in 48 hours.',
      category: 'Security & Identity',
      priority: 'P3',
      status: 'Resolved',
      assigned_team: 'Cloud Security',
      reporter: 'Cert-Manager Daemon',
      impacted_service: 'Enterprise API Ingress',
      ai_suggested_resolution: '1. Run Let-Encrypt ACME renewal sequence.\n2. Deploy updated TLS Secret to production k8s namespace.',
      ai_confidence: 96,
      sla_deadline: sla4
    }
  ]);

  // 2. Seed Assets
  await Asset.insertMany([
    { asset_tag: 'AST-SRV-01', name: 'prod-api-us-east-01', type: 'Kubernetes Cluster', environment: 'Production', status: 'Healthy', ip_address: '10.0.4.12', uptime_percent: 99.98, cpu_usage: 42, memory_usage: 68 },
    { asset_tag: 'AST-DB-02', name: 'prod-db-primary-cluster', type: 'DB Cluster (PostgreSQL)', environment: 'Production', status: 'Warning', ip_address: '10.0.8.45', uptime_percent: 99.85, cpu_usage: 89, memory_usage: 92 },
    { asset_tag: 'AST-GW-03', name: 'prod-ingress-kong-01', type: 'API Gateway', environment: 'Production', status: 'Healthy', ip_address: '10.0.1.5', uptime_percent: 100.0, cpu_usage: 24, memory_usage: 45 },
    { asset_tag: 'AST-REDIS-04', name: 'prod-cache-redis-master', type: 'In-Memory Cache', environment: 'Production', status: 'Healthy', ip_address: '10.0.9.88', uptime_percent: 99.99, cpu_usage: 18, memory_usage: 30 },
    { asset_tag: 'AST-SEC-05', name: 'prod-auth-okta-connector', type: 'Auth Bridge', environment: 'Production', status: 'Healthy', ip_address: '10.0.2.14', uptime_percent: 99.95, cpu_usage: 31, memory_usage: 52 },
    { asset_tag: 'AST-K8S-06', name: 'staging-k8s-us-west-01', type: 'Kubernetes Cluster', environment: 'Staging', status: 'Critical', ip_address: '10.2.0.19', uptime_percent: 94.10, cpu_usage: 98, memory_usage: 97 }
  ]);

  // 3. Seed Service Requests
  await ServiceRequest.insertMany([
    { request_number: 'REQ-5001', title: 'Developer Workstation AWS IAM Provisioning', category: 'Access Management', requested_by: 'Alex Rivera', urgency: 'Medium', approval_status: 'Approved', status: 'Fulfilled' },
    { request_number: 'REQ-5002', title: 'MacBook Pro M3 Max Hardware Replacement', category: 'Hardware Request', requested_by: 'Elena Rostova', urgency: 'High', approval_status: 'Approved', status: 'In Fulfillment' },
    { request_number: 'REQ-5003', title: 'Datadog Enterprise APM License Seat', category: 'Software License', requested_by: 'Marcus Vance', urgency: 'Low', approval_status: 'Pending Approval', status: 'Submitted' }
  ]);

  // 4. Seed Change Requests
  await ChangeRequest.insertMany([
    { change_number: 'CHG-2001', title: 'Upgrade PostgreSQL 14 to PostgreSQL 16 on Core DB', risk_level: 'High', cab_approval: 'Approved', implementation_date: '2026-08-25', assigned_lead: 'David Miller', status: 'Scheduled' },
    { change_number: 'CHG-2002', title: 'Deploy Cloudflare WAF Enterprise Ruleset', risk_level: 'Medium', cab_approval: 'Approved', implementation_date: '2026-08-20', assigned_lead: 'Claire Bennet', status: 'In Review' },
    { change_number: 'CHG-2003', title: 'Node OS Kernel Security Patching (Ubuntu 24.04 LTS)', risk_level: 'Low', cab_approval: 'Pending Review', implementation_date: '2026-08-28', assigned_lead: 'DevOps Rotation', status: 'Planning' }
  ]);

  // 5. Seed Activity Logs
  await ActivityLog.insertMany([
    { action: 'SYSTEM_INIT', user: 'System Engine', details: 'Initialized MongoDB database schema and seeded ITSM dataset.' },
    { action: 'INCIDENT_CREATED', user: 'Prometheus Alertmanager', details: 'Created P1 incident INC-1001 for Payment Gateway Timeout.' },
    { action: 'AI_RECOMMENDATION_GEN', user: 'AI Copilot Service', details: 'Generated confidence score 94% and resolution playbook for INC-1001.' }
  ]);

  console.log('MongoDB seeding complete!');
}

module.exports = { initDatabase };
