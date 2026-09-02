const mongoose = require('mongoose');

const Incident = require('../models/Incident');
const Asset = require('../models/Asset');
const ServiceRequest = require('../models/ServiceRequest');
const ChangeRequest = require('../models/ChangeRequest');
const ActivityLog = require('../models/ActivityLog');
const KnowledgeBase = require('../models/KnowledgeBase');
const memoryStore = require('./memoryStore');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/itsm_db';

const initDatabase = async () => {
  try {
    // Fast 1.5s connection attempt to local MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`✅ Connected to MongoDB at ${MONGODB_URI}`);
    await seedDatabaseIfEmpty(false);
  } catch (err) {
    console.warn(`⚠️ Local MongoDB server not running at ${MONGODB_URI}`);
    console.log(`⚡ Activating Instant High-Performance In-Memory Data Store...`);
    memoryStore.isMemoryMode = true;
    await seedDatabaseIfEmpty(true);
  }
};

async function seedDatabaseIfEmpty(useMemory = false) {
  try {
    const incModel = useMemory ? memoryStore.Incident : Incident;
    const count = await incModel.countDocuments();
    if (count > 0) return;

    console.log('Seeding initial enterprise ITSM & Knowledge Base dataset...');

    const now = new Date();
    const sla1 = new Date(now.getTime() + 1 * 3600 * 1000).toISOString();
    const sla2 = new Date(now.getTime() + 4 * 3600 * 1000).toISOString();
    const sla3 = new Date(now.getTime() + 12 * 3600 * 1000).toISOString();
    const sla4 = new Date(now.getTime() - 2 * 3600 * 1000).toISOString();

    const incidentData = [
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
    ];

    const assetData = [
      { asset_tag: 'AST-SRV-01', name: 'prod-api-us-east-01', type: 'Kubernetes Cluster', environment: 'Production', status: 'Healthy', ip_address: '10.0.4.12', uptime_percent: 99.98, cpu_usage: 42, memory_usage: 68 },
      { asset_tag: 'AST-DB-02', name: 'prod-db-primary-cluster', type: 'DB Cluster (PostgreSQL)', environment: 'Production', status: 'Warning', ip_address: '10.0.8.45', uptime_percent: 99.85, cpu_usage: 89, memory_usage: 92 },
      { asset_tag: 'AST-GW-03', name: 'prod-ingress-kong-01', type: 'API Gateway', environment: 'Production', status: 'Healthy', ip_address: '10.0.1.5', uptime_percent: 100.0, cpu_usage: 24, memory_usage: 45 },
      { asset_tag: 'AST-REDIS-04', name: 'prod-cache-redis-master', type: 'In-Memory Cache', environment: 'Production', status: 'Healthy', ip_address: '10.0.9.88', uptime_percent: 99.99, cpu_usage: 18, memory_usage: 30 },
      { asset_tag: 'AST-SEC-05', name: 'prod-auth-okta-connector', type: 'Auth Bridge', environment: 'Production', status: 'Healthy', ip_address: '10.0.2.14', uptime_percent: 99.95, cpu_usage: 31, memory_usage: 52 },
      { asset_tag: 'AST-K8S-06', name: 'staging-k8s-us-west-01', type: 'Kubernetes Cluster', environment: 'Staging', status: 'Critical', ip_address: '10.2.0.19', uptime_percent: 94.10, cpu_usage: 98, memory_usage: 97 }
    ];

    const serviceReqData = [
      { request_number: 'REQ-5001', title: 'Developer Workstation AWS IAM Provisioning', category: 'Access Management', requested_by: 'Alex Rivera', urgency: 'Medium', approval_status: 'Approved', status: 'Fulfilled' },
      { request_number: 'REQ-5002', title: 'MacBook Pro M3 Max Hardware Replacement', category: 'Hardware Request', requested_by: 'Elena Rostova', urgency: 'High', approval_status: 'Approved', status: 'In Fulfillment' },
      { request_number: 'REQ-5003', title: 'Datadog Enterprise APM License Seat', category: 'Software License', requested_by: 'Marcus Vance', urgency: 'Low', approval_status: 'Pending Approval', status: 'Submitted' }
    ];

    const changeReqData = [
      { change_number: 'CHG-2001', title: 'Upgrade PostgreSQL 14 to PostgreSQL 16 on Core DB', risk_level: 'High', cab_approval: 'Approved', implementation_date: '2026-08-25', assigned_lead: 'David Miller', status: 'Scheduled' },
      { change_number: 'CHG-2002', title: 'Deploy Cloudflare WAF Enterprise Ruleset', risk_level: 'Medium', cab_approval: 'Approved', implementation_date: '2026-08-20', assigned_lead: 'Claire Bennet', status: 'In Review' },
      { change_number: 'CHG-2003', title: 'Node OS Kernel Security Patching (Ubuntu 24.04 LTS)', risk_level: 'Low', cab_approval: 'Pending Review', implementation_date: '2026-08-28', assigned_lead: 'DevOps Rotation', status: 'Planning' }
    ];

    const activityData = [
      { action: 'SYSTEM_INIT', user: 'System Engine', details: 'Initialized ITSM database schema and seeded operational dataset.' },
      { action: 'INCIDENT_CREATED', user: 'Prometheus Alertmanager', details: 'Created P1 incident INC-1001 for Payment Gateway Timeout.' },
      { action: 'AI_RECOMMENDATION_GEN', user: 'AI Copilot Service', details: 'Generated confidence score 94% and resolution playbook for INC-1001.' }
    ];

    const kbData = [
      {
        kb_id: 'KB-8001',
        title: 'Kubernetes Pod OOMKilled & Memory Bottleneck Mitigation',
        category: 'Infrastructure',
        tags: ['Kubernetes', 'DevOps', 'Memory', 'Pod'],
        problem_summary: 'Pods being terminated repeatedly due to exceeding memory limits set in container specifications.',
        resolution_steps: [
          'Run `kubectl describe pod <pod_name>` to confirm OOMKilled status (Exit Code 137).',
          'Inspect application heap dumps and active worker threads.',
          'Increase memory limits in Deployment YAML spec from 512Mi to 2Gi.',
          'Apply autoscaling policy: `kubectl autoscale deployment <deploy_name> --min=3 --max=10 --cpu-percent=80`.'
        ],
        author: 'Senior Site Reliability Lead',
        view_count: 142,
        rating: 4.9
      },
      {
        kb_id: 'KB-8002',
        title: 'PostgreSQL Database Connection Pool Exhaustion Troubleshooting',
        category: 'Database',
        tags: ['PostgreSQL', 'Database', 'Connection Pool', 'PgBouncer'],
        problem_summary: 'API services reporting `FATAL: sorry, too many clients already` database errors.',
        resolution_steps: [
          'Check current active connections: `SELECT count(*) FROM pg_stat_activity WHERE state = \'active\';`',
          'Identify leaked connections and terminate idle sessions older than 10 minutes.',
          'Adjust `max_connections` parameter dynamically in postgresql.conf or restart PgBouncer pooler service.',
          'Verify connection pool size settings in upstream API configurations.'
        ],
        author: 'Principal Database Architect',
        view_count: 98,
        rating: 4.8
      },
      {
        kb_id: 'KB-8003',
        title: 'Active Directory SSO / Kerberos Token Authentication Failure',
        category: 'Security',
        tags: ['Security', 'Identity', 'SSO', 'Active Directory'],
        problem_summary: 'Users experiencing intermittent 401 Unauthorized errors during OAuth2 / Kerberos authentication.',
        resolution_steps: [
          'Verify NTP clock skew across Domain Controllers (must be within 5 seconds).',
          'Flush local DNS cache and verify port 88 (Kerberos) and 389 (LDAP) availability.',
          'Renew Kerberos service principal tickets using `kinit -R`.',
          'Restart Azure AD Connect Sync Agent.'
        ],
        author: 'Lead IAM Specialist',
        view_count: 76,
        rating: 4.7
      },
      {
        kb_id: 'KB-8004',
        title: 'API Gateway Ingress Latency & Circuit Breaker Reset Procedure',
        category: 'Network',
        tags: ['API Gateway', 'Kong', 'Latency', 'Circuit Breaker'],
        problem_summary: 'Gateway responding with 503 Service Unavailable due to circuit breaker trip on downstream microservices.',
        resolution_steps: [
          'Query gateway telemetry metrics endpoint `/metrics/latency`.',
          'Identify failing downstream route target.',
          'Trigger emergency manual reset on gateway admin API: `POST /upstreams/{id}/health`.',
          'Verify target container health check endpoints return HTTP 200.'
        ],
        author: 'Network NOC Operations',
        view_count: 115,
        rating: 4.9
      }
    ];

    if (useMemory) {
      await memoryStore.Incident.insertMany(incidentData);
      await memoryStore.Asset.insertMany(assetData);
      await memoryStore.ServiceRequest.insertMany(serviceReqData);
      await memoryStore.ChangeRequest.insertMany(changeReqData);
      await memoryStore.ActivityLog.insertMany(activityData);
      await memoryStore.KnowledgeBase.insertMany(kbData);
    } else {
      await Incident.insertMany(incidentData);
      await Asset.insertMany(assetData);
      await ServiceRequest.insertMany(serviceReqData);
      await ChangeRequest.insertMany(changeReqData);
      await ActivityLog.insertMany(activityData);
      await KnowledgeBase.insertMany(kbData);
    }

    console.log('✅ ITSM & Knowledge Base dataset successfully seeded!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

module.exports = { initDatabase };
