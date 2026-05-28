// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  evidenceGaps,
  handoffLane,
  reviewPosture,
  summary
} from "../src/services/integrationEvidenceLedgerService.js";

console.log("integration-evidence-ledger demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`handoff lanes: ${handoffLane().length}`);
console.log(`evidence gap findings: ${evidenceGaps().length}`);
console.log(`review packets: ${reviewPosture().length}`);
