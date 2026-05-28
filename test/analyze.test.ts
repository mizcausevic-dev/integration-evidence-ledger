import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { IntegrationEvidenceExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): IntegrationEvidenceExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as IntegrationEvidenceExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts integrations and packets", () => {
    const report = analyze(fixture("integration-evidence.json"), { now: NOW });
    expect(report.integrations).toBe(3);
    expect(report.onTrackIntegrations).toBe(1);
    expect(report.packets).toBe(5);
  });

  it("flags missing on-track integrations as high", () => {
    const report = analyze({ integrations: [], packets: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-on-track-integrations")?.severity).toBe("high");
  });

  it("flags integration evidence gaps", () => {
    const report = analyze(fixture("integration-evidence.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "integration-evidence-gap")?.scope).toBe("IBM App Connect + Kafka");
  });

  it("flags contract, delivery, replay, and workflow gaps", () => {
    const report = analyze(fixture("integration-evidence.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "missing-contract-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-delivery-attestation")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-replay-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "workflow-gap")).toBeDefined();
  });

  it("flags stale open packets", () => {
    const report = analyze(fixture("integration-evidence.json"), { now: NOW, staleDetectionAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-open-packet")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("integration-evidence-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("integration-evidence.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("integration-evidence.json"), { now: NOW }));
    expect(summary).toMatch(/integrations/);
    expect(summary).toMatch(/packets/);
  });
});
