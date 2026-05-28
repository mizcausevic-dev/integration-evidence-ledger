// SPDX-License-Identifier: AGPL-3.0-or-later

import type { CoverageReport } from "./types.js";

function icon(severity: string) {
  return severity === "high" ? "🔴" : severity === "medium" ? "🟠" : severity === "low" ? "🟢" : "🔵";
}

export function toSummary(report: CoverageReport) {
  const posture = report.ok ? "✅" : "❌";
  return `${posture} ${report.integrations} integrations · ${report.packets} packets · ${report.highSeverityPackets} high-severity packets · ${report.workflowGaps} workflow gaps`;
}

export function toMarkdown(report: CoverageReport) {
  const findings = [...report.findingsList]
    .sort((left, right) => {
      const rank = (value: string) => value === "high" ? 0 : value === "medium" ? 1 : value === "low" ? 2 : 3;
      return rank(left.severity) - rank(right.severity);
    })
    .map((finding) => `- ${icon(finding.severity)} **${finding.code}** — ${finding.message}`)
    .join("\n");

  return [
    `# Integration evidence posture ${report.ok ? "✅" : "❌"}`,
    "",
    `- Integrations: **${report.integrations}**`,
    `- On-track integrations: **${report.onTrackIntegrations}**`,
    `- Evidence packets: **${report.packets}**`,
    `- High-severity packets: **${report.highSeverityPackets}**`,
    `- Workflow gaps: **${report.workflowGaps}**`,
    `- Stale packets: **${report.stalePackets}**`,
    "",
    "## Findings",
    findings || "- No findings"
  ].join("\n");
}
