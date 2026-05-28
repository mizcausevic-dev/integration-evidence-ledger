// SPDX-License-Identifier: AGPL-3.0-or-later

import type {
  AnalysisOptions,
  CoverageReport,
  EvidencePacket,
  Finding,
  IntegrationEvidenceExport,
} from "./types.js";

function hoursBetween(startIso: string, endIso: string) {
  return Math.max(0, (Date.parse(endIso) - Date.parse(startIso)) / 36e5);
}

function hasOpenPacket(packets: EvidencePacket[], kind: string) {
  return packets.some((packet) => packet.kind === kind && packet.status === "OPEN");
}

export function analyze(
  payload: IntegrationEvidenceExport,
  options: AnalysisOptions = {}
): CoverageReport {
  const now = options.now ?? new Date().toISOString();
  const staleAfterHours = options.staleDetectionAfterHours ?? 72;
  const findingsList: Finding[] = [];

  const onTrackIntegrations = payload.integrations.filter((integration) => integration.status === "ON_TRACK").length;
  const highSeverityPackets = payload.packets.filter(
    (packet) => packet.status === "OPEN" && packet.severity === "high"
  ).length;
  const workflowGaps = payload.integrations.filter((integration) => !integration.workflowHealthy).length;

  if (onTrackIntegrations === 0) {
    findingsList.push({
      code: "no-on-track-integrations",
      severity: "high",
      subject: "workflow",
      subjectId: "integrations",
      subjectName: "Integration evidence workflow",
      message: "No integrations are currently on track; the evidence queue is operating entirely in exception mode."
    });
  }

  for (const integration of payload.integrations) {
    const integrationPackets = payload.packets.filter((packet) => packet.integrationId === integration.id && packet.status === "OPEN");

    if (integration.status === "AT_RISK" || integrationPackets.length > 0) {
      findingsList.push({
        code: "integration-evidence-gap",
        severity: integration.status === "AT_RISK" ? "high" : "medium",
        subject: "integration",
        subjectId: integration.id,
        subjectName: `${integration.integration} ${integration.id}`,
        owner: integration.owner,
        scope: integration.platform,
        message: `${integration.integration} still has open evidence debt against the ${integration.packet} packet.`
      });
    }

    if (integrationPackets.length > 0 && !hasOpenPacket(integrationPackets, "Contract")) {
      findingsList.push({
        code: "missing-contract-proof",
        severity: "medium",
        subject: "integration",
        subjectId: integration.id,
        subjectName: `${integration.integration} ${integration.id}`,
        owner: integration.owner,
        scope: integration.platform,
        message: "The integration is in exception flow but does not currently show a clean contract or schema packet in the queue."
      });
    }

    if (!integration.workflowHealthy) {
      findingsList.push({
        code: "workflow-gap",
        severity: "medium",
        subject: "workflow",
        subjectId: integration.id,
        subjectName: `${integration.integration} ${integration.id}`,
        owner: integration.owner,
        scope: integration.platform,
        message: "Owner-safe handoff routing is degraded; delivery, replay, and escalation review are still split across teams."
      });
    }
  }

  for (const packet of payload.packets) {
    if (packet.status !== "OPEN") continue;

    if (packet.domain === "SCHEMA" || packet.kind === "Contract") {
      findingsList.push({
        code: "missing-contract-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.integration} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.domain === "DELIVERY" || packet.kind === "Delivery") {
      findingsList.push({
        code: "missing-delivery-attestation",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.integration} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.domain === "REPLAY" || packet.kind === "Replay") {
      findingsList.push({
        code: "missing-replay-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.integration} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (!packet.owner && packet.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "high",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        scope: packet.scope,
        message: "A high-severity integration evidence packet is still unassigned."
      });
    }

    if (hoursBetween(packet.openedAt, now) >= staleAfterHours) {
      findingsList.push({
        code: "stale-open-packet",
        severity: packet.severity === "high" ? "high" : "medium",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: `${packet.kind} evidence has been open longer than the integration review SLA.`
      });
    }
  }

  return {
    ok: findingsList.every((finding) => finding.severity !== "high"),
    integrations: payload.integrations.length,
    onTrackIntegrations,
    packets: payload.packets.length,
    highSeverityPackets,
    workflowGaps,
    stalePackets: findingsList.filter((finding) => finding.code === "stale-open-packet").length,
    findingsList
  };
}
