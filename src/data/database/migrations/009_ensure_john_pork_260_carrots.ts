import type { Migration } from './types';

export const migration009: Migration = {
  version: 9,
  name: 'ensure_john_pork_260_carrots',
  up: `
UPDATE tester_profiles SET first_name = 'John', last_name = 'Pork';

DELETE FROM carrot_ledger WHERE source_entity_id LIKE '%john_pork_260%' OR source_entity_id LIKE '%grant_260%';

INSERT INTO carrot_ledger (local_id, tester_id, event_type, quantity, source_entity_type, source_entity_id, reason, earned_at, created_at, sync_state)
SELECT 'carrot_grant_260_' || local_id, local_id, 'admin_reward_260', 259, 'admin_grant', 'grant_260_id_' || local_id, '260 Carrots for John Pork', 1700000000000, 1700000000000, 'local'
FROM tester_profiles;
`,
};
