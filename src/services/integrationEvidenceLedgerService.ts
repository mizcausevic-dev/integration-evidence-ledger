// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { handoffLanes, reviewPackets, sampleIntegrationEvidencePayload } from "../data/sampleIntegrationEvidence.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-31T00:00:00Z";
const report = analyze(sampleIntegrationEvidencePayload, {
  now: NOW,
  staleDetectionAfterHours: 72
});

function severityRank(finding: Finding): number {
  return finding.severity === "high" ? 0 : finding.severity === "medium" ? 1 : finding.severity === "low" ? 2 : 3;
}

export function summary() {
  return {
    integrations: report.integrations,
    onTrackIntegrations: report.onTrackIntegrations,
    packets: report.packets,
    highSeverityPackets: report.highSeverityPackets,
    workflowGaps: report.workflowGaps,
    stalePackets: report.stalePackets,
    recommendation:
      "Restore missing contract proof, close the delivery and replay packet gaps, repair stale escalation attestations, and stabilize ownership before the next handoff checkpoint."
  };
}

export function handoffLane() {
  return handoffLanes.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "contract-lane") return finding.code === "integration-evidence-gap" || finding.code === "missing-contract-proof";
      if (lane.id === "delivery-lane") return finding.code === "missing-delivery-attestation" || finding.code === "stale-open-packet";
      if (lane.id === "replay-lane") return finding.code === "missing-replay-proof" || finding.code === "workflow-gap";
      if (lane.id === "fallback-lane") return finding.code === "high-severity-unassigned" || finding.code === "stale-open-packet";
      return false;
    }).length
  }));
}

export function evidenceGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "missing-contract-proof"
          ? "Integration Governance"
          : finding.code === "missing-delivery-attestation"
            ? "Connector Delivery"
            : finding.code === "missing-replay-proof"
              ? "Reliability Integration Office"
              : "Escalation Operations")
    }));
}

export function reviewPosture() {
  return reviewPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline integration-evidence analyzer and CLI, not static copy alone.",
    "Integrations, packets, and handoff snapshots are synthetic sample data only; no live tenant payloads or credentials are published.",
    "The control plane keeps contract proof, delivery drift, replay evidence, and checkpoint readiness visible for release and audit stakeholders.",
    "This surface demonstrates integration evidence routing and review-safe sequencing, not a generic middleware keyword page.",
    "It complements workflow, identity, and governance surfaces with a reusable handoff evidence-routing primitive."
  ];
}

export const validation = verification;

export function payload() {
  return {
    summary: summary(),
    handoffLane: handoffLane(),
    evidenceGaps: evidenceGaps(),
    reviewPosture: reviewPosture(),
    verification: verification(),
    sample: sampleIntegrationEvidencePayload
  };
}
