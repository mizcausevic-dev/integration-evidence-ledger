// SPDX-License-Identifier: AGPL-3.0-or-later

import { readFile } from "node:fs/promises";

import { analyze } from "./analyze.js";
import { toMarkdown, toSummary } from "./format.js";
import type { IntegrationEvidenceExport } from "./types.js";

async function main() {
  const args = process.argv.slice(2);
  const input = args[0];
  if (!input) {
    console.error("Usage: integration-ledger <export.json> [--format markdown|summary] [--stale-hours N]");
    process.exitCode = 1;
    return;
  }

  const formatIndex = args.indexOf("--format");
  const format = formatIndex >= 0 ? args[formatIndex + 1] : "markdown";
  const staleIndex = args.indexOf("--stale-hours");
  const staleHours = staleIndex >= 0 ? Number(args[staleIndex + 1]) : 72;

  const payload = JSON.parse(await readFile(input, "utf8")) as IntegrationEvidenceExport;
  const report = analyze(payload, { staleDetectionAfterHours: staleHours });

  if (format === "summary") {
    console.log(toSummary(report));
    return;
  }

  console.log(toMarkdown(report));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
