/**
 * AI-Powered IT Operations Resolution Engine
 */

const KNOWLEDGE_BASE_PLAYBOOKS = [
  {
    keywords: ['database', 'postgres', 'mysql', 'sql', 'connection pool', 'deadlock', 'query timeout', 'max_connections'],
    category: 'Database',
    team: 'Database Administrators',
    resolution: `1. Check active backend connections: Run 'SELECT * FROM pg_stat_activity WHERE state = "active";'
2. Identify slow-running queries and cancel hanging process PIDs using 'pg_cancel_backend(pid)'.
3. Increase max pool size or restart PgBouncer pooler service.
4. Scale DB read-replica load balancing if query traffic persists high.`,
    rootCause: 'Database connection pool exhaustion caused by unindexed query lock escalation.'
  },
  {
    keywords: ['latency', 'timeout', '504', '502', 'gateway', 'payment', 'api', 'ingress', 'http'],
    category: 'Infrastructure',
    team: 'DevOps & Site Reliability',
    resolution: `1. Scale Kubernetes pod deployment horizontally (kubectl scale deployment --replicas=15).
2. Check upstream microservice health status & latency metrics in APM dashboard.
3. Temporarily enable cloud edge cache rate limiting for non-essential traffic.
4. Flush socket connections and clear cache node buffers.`,
    rootCause: 'Ingress traffic surge exceeding container memory boundaries and thread pool limit.'
  },
  {
    keywords: ['auth', 'sso', 'active directory', 'ldap', 'vpn', 'login', 'permission', 'certificate', 'jwt', 'iam'],
    category: 'Security & Identity',
    team: 'SecOps & IAM Team',
    resolution: `1. Verify LDAP/Active Directory domain controller synchronization status.
2. Inspect Kerberos authentication ticket expiration timestamps.
3. Refresh OAuth2 client secrets and API gateway authorization tokens.
4. Check internal VPN security group ingress whitelist rules.`,
    rootCause: 'Domain controller SSL certificate handshake mismatch during automated credential validation.'
  },
  {
    keywords: ['cpu', 'memory', 'disk', 'out of memory', 'oom', 'storage', 'node', 'server', 'restart'],
    category: 'Infrastructure',
    team: 'Cloud Platform Ops',
    resolution: `1. Identify top memory consuming process using 'top' or 'htop'.
2. Purge system log files in '/var/log' and container temp caches.
3. Auto-expand cloud EBS volume storage capacity by +50GB.
4. Gracefully restart node daemon services to release memory leaks.`,
    rootCause: 'Unrestricted log growth leading to local disk space exhaustion and kernel OOM kill.'
  },
  {
    keywords: ['network', 'dns', 'packet loss', 'firewall', 'traceroute', 'subnet', 'bgp', 'router'],
    category: 'Network Operations',
    team: 'Network Operations Center (NOC)',
    resolution: `1. Check DNS resolution status across internal and public nameservers (dig/nslookup).
2. Inspect cloud VPC security group ingress/egress filtering rules.
3. Failover BGP primary network interface to secondary backup ISP link.
4. Verify core switch packet loss statistics and interface duplex modes.`,
    rootCause: 'BGP routing loop at primary cloud provider transit gateway.'
  }
];

function analyzeIncident(title, description = '', category = '', impactedService = '') {
  const combinedText = `${title} ${description} ${category} ${impactedService}`.toLowerCase();

  // 1. Determine Priority
  let priority = 'P3';
  let confidence = 85;

  const isCriticalKeywords = ['down', 'outage', 'crash', '504', '500', 'payment', 'production', 'core db', 'master', 'security breach'];
  const isHighKeywords = ['latency', 'slow', 'timeout', 'warning', 'degraded', 'failover', 'vpn', 'auth'];

  const criticalMatches = isCriticalKeywords.filter(kw => combinedText.includes(kw));
  const highMatches = isHighKeywords.filter(kw => combinedText.includes(kw));

  if (criticalMatches.length > 0 || (impactedService.toLowerCase().includes('payment') || impactedService.toLowerCase().includes('core'))) {
    priority = 'P1';
    confidence = 94 + Math.min(criticalMatches.length * 2, 5);
  } else if (highMatches.length > 0) {
    priority = 'P2';
    confidence = 88 + Math.min(highMatches.length * 2, 6);
  } else if (combinedText.includes('low') || combinedText.includes('minor') || combinedText.includes('request')) {
    priority = 'P4';
    confidence = 82;
  }

  // 2. Playbook Matching
  let matchedPlaybook = KNOWLEDGE_BASE_PLAYBOOKS.find(pb =>
    pb.keywords.some(kw => combinedText.includes(kw))
  );

  if (!matchedPlaybook) {
    matchedPlaybook = {
      category: category || 'IT Operations',
      team: 'Tier-1 IT Service Desk',
      resolution: `1. Gather full system diagnostic logs and trace IDs.\n2. Verify impact scope across user groups.\n3. Escalate ticket to Tier-2 engineering duty manager if unresolved within 30 minutes.`,
      rootCause: 'Underlying component failure requiring log inspection.'
    };
  }

  // 3. SLA Deadline calculation
  const now = new Date();
  let hoursToAdd = 12;
  if (priority === 'P1') hoursToAdd = 1;
  else if (priority === 'P2') hoursToAdd = 4;
  else if (priority === 'P3') hoursToAdd = 12;
  else if (priority === 'P4') hoursToAdd = 48;

  const slaDeadline = new Date(now.getTime() + hoursToAdd * 3600 * 1000).toISOString();

  return {
    priority,
    category: matchedPlaybook.category,
    assignedTeam: matchedPlaybook.team,
    aiSuggestedResolution: matchedPlaybook.resolution,
    rootCauseHypothesis: matchedPlaybook.rootCause,
    aiConfidence: Math.min(confidence, 99),
    slaDeadline
  };
}

function processCopilotChat(prompt, context = {}) {
  const query = prompt.toLowerCase();

  if (query.includes('p1') || query.includes('critical') || query.includes('outage')) {
    return {
      response: `🚨 **P1 Incident Resolution Guidance**:
For P1 Critical Outages:
1. Immediately declare a Major Incident Command Bridge.
2. Check impacted core services (Payment Gateway, Core DB, Ingress).
3. Review recent deployment changes in the last 4 hours (e.g. CHG-2001).
4. Run automated rollback scripts if a recent code release coincides with the outage window.`,
      suggestedActions: ['Trigger PagerDuty Incident', 'Open Incident Command Bridge', 'Check CloudWatch Alarms']
    };
  }

  if (query.includes('post-mortem') || query.includes('postmortem') || query.includes('summary')) {
    return {
      response: `📋 **AI Incident Post-Mortem Template**:
- **Incident ID**: INC-1001
- **Severity**: P1 - Critical
- **Total Downtime**: 24 minutes
- **Root Cause**: Ingress gateway thread pool exhaustion during unexpected peak traffic.
- **Resolution**: Scaled Kubernetes replicas from 8 to 20; restarted connection pool.
- **Preventative Measures**: Implement auto-scaling threshold at 70% CPU usage.`,
      suggestedActions: ['Export to Confluence/PDF', 'Schedule Root Cause Review']
    };
  }

  if (query.includes('database') || query.includes('postgres') || query.includes('lock')) {
    return {
      response: `🗄️ **Database Troubleshooting Advice**:
1. Check pg_stat_activity for query blocks.
2. Verify replica lag metrics on DB cluster nodes.
3. Check memory utilization on primary host node AST-DB-02.`,
      suggestedActions: ['View DB Health Metrics', 'Analyze Query Performance']
    };
  }

  return {
    response: `🤖 **AI IT Operations Assistant**:
I analyzed your query: "${prompt}".
Based on our ITSM Knowledge Base:
- System state is 99.8% operational across 6 infrastructure nodes.
- 2 open P1 incidents are currently undergoing resolution.
- Recommended Next Step: Ensure all active incidents have assigned duty leads and SLA timers set.`,
    suggestedActions: ['View Open Incidents', 'Check SLA Compliance', 'Run Diagnostic Check']
  };
}

module.exports = {
  analyzeIncident,
  processCopilotChat
};
