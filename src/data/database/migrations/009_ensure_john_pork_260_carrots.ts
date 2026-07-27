import type { Migration } from './types';

export const migration009: Migration = {
  version: 9,
  name: 'ensure_john_pork_260_carrots',
  up: `
UPDATE tester_profiles SET first_name = 'John', last_name = 'Pork';

WITH RECURSIVE cnt(x) AS (
  SELECT 1
  UNION ALL
  SELECT x + 1 FROM cnt WHERE x < 260
)
INSERT OR IGNORE INTO test_sessions (
  local_id, client_id, tester_id, display_test_number, status, is_group_testing, test_schema_version, started_at, completed_at, created_at, updated_at, record_version, sync_state
)
SELECT 
  'session_john_pork_' || t.local_id || '_' || c.x,
  'client_john_pork_' || t.local_id || '_' || c.x,
  t.local_id,
  '#' || (100 + c.x),
  'completed',
  0,
  1,
  1700000000000 + (c.x * 1000),
  1700000000000 + (c.x * 1000) + 300000,
  1700000000000 + (c.x * 1000),
  1700000000000 + (c.x * 1000),
  1,
  'local'
FROM tester_profiles t
CROSS JOIN cnt c;

WITH RECURSIVE cnt(x) AS (
  SELECT 1
  UNION ALL
  SELECT x + 1 FROM cnt WHERE x < 260
)
INSERT OR IGNORE INTO clients (
  local_id, ooxii_client_id, year_of_birth, gender, cataract_surgery, country, state_province, city, created_by_tester_id, created_at, updated_at, record_version, sync_state
)
SELECT
  'client_john_pork_' || t.local_id || '_' || c.x,
  CAST(82000 + c.x AS TEXT),
  1970 + (c.x % 30),
  CASE WHEN c.x % 2 = 0 THEN 'Male' ELSE 'Female' END,
  'No',
  'Australia',
  'NSW',
  'Sydney',
  t.local_id,
  1700000000000 + (c.x * 1000),
  1700000000000 + (c.x * 1000),
  1,
  'local'
FROM tester_profiles t
CROSS JOIN cnt c;
`,
};
