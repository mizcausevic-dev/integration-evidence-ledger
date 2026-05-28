// SPDX-License-Identifier: AGPL-3.0-or-later

export type IntegrationStatus = "ON_TRACK" | "AT_RISK";
export type PacketStatus = "OPEN" | "RESOLVED";
export type Severity = "high" | "medium" | "low" | "info";
export type EvidenceKind = "Contract" | "Delivery" | "Replay" | "Escalation" | "Attestation" | string;
export type GovernanceDomain = "SCHEMA" | "DELIVERY" | "REPLAY" | "ESCALATION" | "CONNECTOR" | string;

export interface IntegrationRun {
  id: string;
  integration: string;
  handoff: string;
  platform: string;
  owner: string;
  status: IntegrationStatus;
  workflowHealthy: boolean;
  hoursToCheckpoint: number;
  packet: string;
  excerpt: string;
  nextAction: string;
}

export interface EvidencePacket {
  id: string;
  integrationId: string;
  integration: string;
  handoff: string;
  platform: string;
  owner?: string;
  domain: GovernanceDomain;
  kind: EvidenceKind;
  severity: Severity;
  status: PacketStatus;
  scope: string;
  principal?: string;
  message: string;
  openedAt: string;
  dueAt: string;
}

export interface IntegrationEvidenceExport {
  integrations: IntegrationRun[];
  packets: EvidencePacket[];
}

export type FindingCode =
  | "no-on-track-integrations"
  | "integration-evidence-gap"
  | "missing-contract-proof"
  | "missing-delivery-attestation"
  | "missing-replay-proof"
  | "workflow-gap"
  | "stale-open-packet"
  | "high-severity-unassigned";

export interface Finding {
  code: FindingCode;
  severity: Severity;
  subject: "integration" | "packet" | "workflow";
  subjectId: string;
  subjectName?: string;
  owner?: string;
  scope?: string;
  principal?: string;
  message: string;
}

export interface AnalysisOptions {
  now?: string;
  staleDetectionAfterHours?: number;
}

export interface CoverageReport {
  ok: boolean;
  integrations: number;
  onTrackIntegrations: number;
  packets: number;
  highSeverityPackets: number;
  workflowGaps: number;
  stalePackets: number;
  findingsList: Finding[];
}
