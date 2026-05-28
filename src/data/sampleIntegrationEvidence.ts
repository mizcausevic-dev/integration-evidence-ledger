// SPDX-License-Identifier: AGPL-3.0-or-later

import type { IntegrationEvidenceExport } from "../types.js";

export const sampleIntegrationEvidencePayload: IntegrationEvidenceExport = {
  integrations: [
    {
      id: "IEL-1042",
      integration: "Claims CRM -> policy core sync",
      handoff: "Lead intake to policy issuance",
      platform: "IBM App Connect + Kafka",
      owner: "Integration Governance",
      status: "AT_RISK",
      workflowHealthy: false,
      hoursToCheckpoint: 18,
      packet: "Contract and delivery packet",
      excerpt: "Launch review found missing schema signoff evidence and incomplete dead-letter replay attestation.",
      nextAction: "Route the contract packet and replay attestation before the checkpoint review."
    },
    {
      id: "IEL-2077",
      integration: "HRIS -> provisioning event bus",
      handoff: "Hire event to workspace creation",
      platform: "MuleSoft + Workday",
      owner: "Operations Readiness",
      status: "ON_TRACK",
      workflowHealthy: true,
      hoursToCheckpoint: 42,
      packet: "Delivery and SLA packet",
      excerpt: "Delivery packet is complete; only release-ops acknowledgment is pending.",
      nextAction: "Keep the packet ready and hold for checkpoint signoff."
    },
    {
      id: "IEL-3109",
      integration: "Outage alert -> service-desk workflow",
      handoff: "Detection event to remediation queue",
      platform: "EventBridge + ServiceNow",
      owner: "Reliability Integration Office",
      status: "AT_RISK",
      workflowHealthy: false,
      hoursToCheckpoint: 12,
      packet: "Replay, escalation, and fallback packet",
      excerpt: "Governance review reopened after replay drift and stale escalation evidence across the incident handoff.",
      nextAction: "Repair the escalation chronology and finalize replay proof for the high-volume handoff."
    }
  ],
  packets: [
    {
      id: "PKT-001",
      integrationId: "IEL-1042",
      integration: "Claims CRM -> policy core sync",
      handoff: "Lead intake to policy issuance",
      platform: "IBM App Connect + Kafka",
      owner: "Integration Governance",
      domain: "SCHEMA",
      kind: "Contract",
      severity: "high",
      status: "OPEN",
      scope: "Schema packet review",
      principal: "Schema signoff packet",
      message: "Contract packet is still missing the final schema signoff proof referenced in the release review.",
      openedAt: "2026-05-24T08:00:00Z",
      dueAt: "2026-05-30T18:00:00Z"
    },
    {
      id: "PKT-002",
      integrationId: "IEL-1042",
      integration: "Claims CRM -> policy core sync",
      handoff: "Lead intake to policy issuance",
      platform: "IBM App Connect + Kafka",
      owner: "Connector Delivery",
      domain: "DELIVERY",
      kind: "Delivery",
      severity: "medium",
      status: "OPEN",
      scope: "Delivery handoff review",
      principal: "Dead-letter attestation",
      message: "Delivery packet does not yet reconcile the dead-letter policy and consumer recovery path.",
      openedAt: "2026-05-26T12:00:00Z",
      dueAt: "2026-05-30T18:00:00Z"
    },
    {
      id: "PKT-003",
      integrationId: "IEL-3109",
      integration: "Outage alert -> service-desk workflow",
      handoff: "Detection event to remediation queue",
      platform: "EventBridge + ServiceNow",
      owner: "Reliability Integration Office",
      domain: "REPLAY",
      kind: "Replay",
      severity: "high",
      status: "OPEN",
      scope: "Replay packet",
      principal: "Replay chronology",
      message: "Replay packet is missing the final chronology tying event retries to the remediation fallback path.",
      openedAt: "2026-05-23T09:30:00Z",
      dueAt: "2026-05-29T21:00:00Z"
    },
    {
      id: "PKT-004",
      integrationId: "IEL-3109",
      integration: "Outage alert -> service-desk workflow",
      handoff: "Detection event to remediation queue",
      platform: "EventBridge + ServiceNow",
      owner: "Escalation Operations",
      domain: "ESCALATION",
      kind: "Escalation",
      severity: "medium",
      status: "OPEN",
      scope: "Escalation review",
      principal: "Fallback routing packet",
      message: "Escalation evidence needs reattached proof after the reopened integration review.",
      openedAt: "2026-05-25T16:00:00Z",
      dueAt: "2026-05-29T21:00:00Z"
    },
    {
      id: "PKT-005",
      integrationId: "IEL-2077",
      integration: "HRIS -> provisioning event bus",
      handoff: "Hire event to workspace creation",
      platform: "MuleSoft + Workday",
      owner: "Operations Readiness",
      domain: "DELIVERY",
      kind: "Attestation",
      severity: "low",
      status: "RESOLVED",
      scope: "Delivery and release packet",
      principal: "Delivery completion proof",
      message: "Delivery packet was accepted on the last release-governance touchpoint.",
      openedAt: "2026-05-22T10:00:00Z",
      dueAt: "2026-05-28T17:00:00Z"
    }
  ]
};

export const handoffLanes = [
  {
    id: "contract-lane",
    lane: "Contract and schema packet triage",
    owner: "Integration Governance",
    focus: "Missing schema signoff proof and handoff-safe contract context",
    status: "RED",
    nextAction: "Repair the two at-risk packets before handoff posture hardens.",
    note: "The intake desk should surface which integrations are missing contract proof, not just sync counts."
  },
  {
    id: "delivery-lane",
    lane: "Connector delivery and replay routing",
    owner: "Connector Delivery",
    focus: "Delivery evidence and dead-letter visibility",
    status: "YELLOW",
    nextAction: "Close the dead-letter attestation gap for IEL-1042.",
    note: "Delivery packets need owner-safe sequencing before they become audit exceptions."
  },
  {
    id: "replay-lane",
    lane: "Replay and retry governance",
    owner: "Reliability Integration Office",
    focus: "Replay evidence and retry-safe sequencing",
    status: "YELLOW",
    nextAction: "Complete replay chronology reconciliation for the outage handoff.",
    note: "Replay drift should stay visible before it contaminates production posture."
  },
  {
    id: "fallback-lane",
    lane: "Escalation and fallback operations",
    owner: "Escalation Operations",
    focus: "Fallback routing, incident review, and compensating-action proof",
    status: "RED",
    nextAction: "Finalize the fallback chronology and repair stale escalation proof.",
    note: "Integration packets must stay readable to both platform leads and auditors."
  }
];

export const reviewPackets = [
  {
    packetId: "IPK-14",
    lane: "Claims CRM sync",
    owner: "Integration Governance",
    completenessScore: 58,
    status: "RED",
    blocker: "Schema signoff proof still missing",
    launchWindowHours: 18,
    decisionNote: "Do not clear the handoff until the contract packet and replay attestation are bundled together."
  },
  {
    packetId: "IPK-18",
    lane: "HRIS provisioning bus",
    owner: "Operations Readiness",
    completenessScore: 91,
    status: "GREEN",
    blocker: "No active blocker",
    launchWindowHours: 42,
    decisionNote: "Packet is safe for checkpoint confirmation and operator follow-up."
  },
  {
    packetId: "IPK-22",
    lane: "Outage alert handoff",
    owner: "Reliability Integration Office",
    completenessScore: 63,
    status: "YELLOW",
    blocker: "Replay chronology is stale",
    launchWindowHours: 12,
    decisionNote: "Review can clear if the replay packet is repaired in the current checkpoint window."
  }
];
