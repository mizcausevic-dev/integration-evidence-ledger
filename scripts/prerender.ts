// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdir, writeFile } from "node:fs/promises";

import {
  evidenceGaps,
  handoffLane,
  payload,
  reviewPosture,
  summary,
  verification
} from "../src/services/integrationEvidenceLedgerService.js";
import {
  renderDocs,
  renderEvidenceGaps,
  renderHandoffLane,
  renderOverview,
  renderReviewPosture,
  renderValidation
} from "../src/services/render.js";

async function writePage(route: string, html: string) {
  const directory = route === "/" ? "site" : `site${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html, "utf8");
}

async function writeJson(name: string, value: unknown) {
  await mkdir("site/api", { recursive: true });
  await writeFile(`site/api/${name}.json`, JSON.stringify(value, null, 2), "utf8");
}

await writePage("/", renderOverview());
await writePage("/handoff-lane", renderHandoffLane());
await writePage("/evidence-gaps", renderEvidenceGaps());
await writePage("/review-posture", renderReviewPosture());
await writePage("/verification", renderValidation());
await writePage("/docs", renderDocs());

await writeJson("summary", summary());
await writeJson("handoff-lane", handoffLane());
await writeJson("evidence-gaps", evidenceGaps());
await writeJson("review-posture", reviewPosture());
await writeJson("verification", verification());
await writeJson("sample", payload());
