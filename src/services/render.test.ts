import { describe, expect, test } from "vitest";

import { renderDocs, renderOverview } from "./render.js";

describe("render surfaces", () => {
  test("overview carries the new integration ledger title", () => {
    expect(renderOverview()).toContain("Integration Evidence Ledger");
    expect(renderOverview()).toContain("/handoff-lane");
  });

  test("docs route exposes the CLI and API shape", () => {
    const html = renderDocs();
    expect(html).toContain("integration-ledger");
    expect(html).toContain("/api/evidence-gaps");
  });
});
