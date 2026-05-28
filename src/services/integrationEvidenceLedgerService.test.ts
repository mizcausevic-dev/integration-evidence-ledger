import { describe, expect, test } from "vitest";

import {
  evidenceGaps,
  handoffLane,
  payload,
  reviewPosture,
  summary,
  validation
} from "./integrationEvidenceLedgerService.js";

describe("integration evidence ledger service", () => {
  test("summary reports integration and packet counts", () => {
    const result = summary();
    expect(result.integrations).toBe(3);
    expect(result.onTrackIntegrations).toBe(1);
    expect(result.packets).toBe(5);
  });

  test("lane and review packets are present", () => {
    expect(handoffLane()).toHaveLength(4);
    expect(reviewPosture()).toHaveLength(3);
  });

  test("payload includes evidence findings and verification", () => {
    expect(evidenceGaps().length).toBeGreaterThan(0);
    expect(validation()).toHaveLength(5);
    expect(payload().sample.integrations[0]?.integration).toBe("Claims CRM -> policy core sync");
  });
});
