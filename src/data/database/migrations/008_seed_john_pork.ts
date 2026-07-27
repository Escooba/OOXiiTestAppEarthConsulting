import type { Migration } from './types';

export const migration008: Migration = {
  version: 8,
  name: 'seed_john_pork',
  up: `
INSERT OR IGNORE INTO tester_profiles (
  local_id, first_name, last_name, gender, role, experience_level, organisation, country, state_province, city, first_login_guide_completed, created_at, updated_at, record_version, sync_state
) VALUES (
  'tester_john_pork', 'John', 'Pork', 'Male', 'Community Health Tester', 'Senior', 'OOXii Earth Consulting', 'Australia', 'NSW', 'Sydney', 1, 1700000000000, 1700000000000, 1, 'local'
);

UPDATE tester_profiles SET first_name = 'John', last_name = 'Pork' WHERE first_name != 'John' OR last_name != 'Pork';

INSERT OR IGNORE INTO carrot_ledger (local_id, tester_id, event_type, quantity, source_entity_type, source_entity_id, reason, earned_at, created_at, sync_state)
SELECT 'carrot_john_pork_260_' || local_id, local_id, 'reward', 260, 'grant', 'grant_john_pork_260', 'Bonus 260 Carrots for John Pork', 1700000000000, 1700000000000, 'local'
FROM tester_profiles;
`,
};
