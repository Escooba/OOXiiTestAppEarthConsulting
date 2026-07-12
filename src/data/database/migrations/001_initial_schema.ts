// ============================================================================
// Migration 001 — Initial schema
// ============================================================================

import type { Migration } from './types';

export const migration001: Migration = {
  version: 1,
  name: 'initial_schema',
  up: `
CREATE TABLE IF NOT EXISTS schema_migrations (
  version INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at INTEGER NOT NULL,
  checksum TEXT
);

CREATE TABLE IF NOT EXISTS app_metadata (
  installation_id TEXT PRIMARY KEY,
  db_schema_version INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  last_opened_at INTEGER NOT NULL,
  last_successful_sync_at INTEGER
);

CREATE TABLE IF NOT EXISTS tester_profiles (
  local_id TEXT PRIMARY KEY,
  remote_id TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  experience_level TEXT NOT NULL DEFAULT '',
  organisation TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  state_province TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  first_login_guide_completed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  record_version INTEGER NOT NULL DEFAULT 1,
  sync_state TEXT NOT NULL DEFAULT 'local'
);

CREATE TABLE IF NOT EXISTS clinics (
  local_id TEXT PRIMARY KEY,
  remote_id TEXT,
  clinic_name TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  state_province TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  record_version INTEGER NOT NULL DEFAULT 1,
  sync_state TEXT NOT NULL DEFAULT 'local'
);

CREATE TABLE IF NOT EXISTS clients (
  local_id TEXT PRIMARY KEY,
  remote_id TEXT,
  ooxii_client_id TEXT NOT NULL,
  year_of_birth INTEGER NOT NULL,
  gender TEXT NOT NULL DEFAULT '',
  cataract_surgery TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  state_province TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  created_by_tester_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  record_version INTEGER NOT NULL DEFAULT 1,
  sync_state TEXT NOT NULL DEFAULT 'local',
  FOREIGN KEY (created_by_tester_id) REFERENCES tester_profiles(local_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_ooxii_id ON clients(ooxii_client_id) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS test_sessions (
  local_id TEXT PRIMARY KEY,
  remote_id TEXT,
  client_id TEXT NOT NULL,
  tester_id TEXT NOT NULL,
  clinic_id TEXT,
  display_test_number TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  current_route TEXT,
  active_test_module TEXT,
  is_group_testing INTEGER NOT NULL DEFAULT 0,
  test_schema_version INTEGER NOT NULL DEFAULT 1,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  deleted_at INTEGER,
  record_version INTEGER NOT NULL DEFAULT 1,
  sync_state TEXT NOT NULL DEFAULT 'local',
  FOREIGN KEY (client_id) REFERENCES clients(local_id),
  FOREIGN KEY (tester_id) REFERENCES tester_profiles(local_id),
  FOREIGN KEY (clinic_id) REFERENCES clinics(local_id)
);

CREATE INDEX IF NOT EXISTS idx_test_sessions_client ON test_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_tester ON test_sessions(tester_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);

CREATE TABLE IF NOT EXISTS test_session_sections (
  local_id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  section_type TEXT NOT NULL,
  section_schema_version INTEGER NOT NULL DEFAULT 1,
  payload TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(test_session_id, section_type),
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(local_id)
);

CREATE TABLE IF NOT EXISTS visual_acuity_measurements (
  local_id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  phase TEXT NOT NULL,
  test_method TEXT NOT NULL DEFAULT '',
  eye_context TEXT NOT NULL,
  correction_context TEXT NOT NULL,
  ooxii_line TEXT,
  letters_on_next_line INTEGER,
  snellen_metres TEXT,
  snellen_imperial TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(local_id)
);

CREATE INDEX IF NOT EXISTS idx_va_session ON visual_acuity_measurements(test_session_id);

CREATE TABLE IF NOT EXISTS prescriptions (
  local_id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  eye_side TEXT NOT NULL,
  prescription_mode TEXT NOT NULL DEFAULT '',
  sphere TEXT,
  cylinder TEXT,
  axis TEXT,
  lens_type TEXT,
  add_on TEXT,
  toric_power TEXT,
  toric_gauge TEXT,
  best_lens_display TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(local_id)
);

CREATE TABLE IF NOT EXISTS dispensed_items (
  local_id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  item_category TEXT NOT NULL,
  right_lens TEXT,
  left_lens TEXT,
  frame_colour TEXT,
  frame_front_colour TEXT,
  right_arm_colour TEXT,
  left_arm_colour TEXT,
  frame_size TEXT,
  frame_type TEXT,
  item_identifier TEXT,
  dispensed INTEGER NOT NULL DEFAULT 0,
  price_cents INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(local_id)
);

CREATE TABLE IF NOT EXISTS completion_checklist_items (
  local_id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  checklist_code TEXT NOT NULL,
  label TEXT NOT NULL,
  checked INTEGER NOT NULL DEFAULT 0,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(local_id)
);

CREATE TABLE IF NOT EXISTS clinical_referrals (
  local_id TEXT PRIMARY KEY,
  test_session_id TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  destination TEXT,
  cataract_right INTEGER NOT NULL DEFAULT 0,
  cataract_left INTEGER NOT NULL DEFAULT 0,
  diabetic_retinopathy_right INTEGER NOT NULL DEFAULT 0,
  diabetic_retinopathy_left INTEGER NOT NULL DEFAULT 0,
  corneal_scar_right INTEGER NOT NULL DEFAULT 0,
  corneal_scar_left INTEGER NOT NULL DEFAULT 0,
  maculopathy_right INTEGER NOT NULL DEFAULT 0,
  maculopathy_left INTEGER NOT NULL DEFAULT 0,
  glaucoma_right INTEGER NOT NULL DEFAULT 0,
  glaucoma_left INTEGER NOT NULL DEFAULT 0,
  other_condition_right INTEGER NOT NULL DEFAULT 0,
  other_condition_left INTEGER NOT NULL DEFAULT 0,
  referral_urgency TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (test_session_id) REFERENCES test_sessions(local_id)
);

CREATE TABLE IF NOT EXISTS carrot_ledger (
  local_id TEXT PRIMARY KEY,
  tester_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  source_entity_type TEXT NOT NULL,
  source_entity_id TEXT NOT NULL,
  reason TEXT NOT NULL DEFAULT '',
  earned_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  sync_state TEXT NOT NULL DEFAULT 'local',
  remote_id TEXT,
  UNIQUE(event_type, source_entity_id),
  FOREIGN KEY (tester_id) REFERENCES tester_profiles(local_id)
);

CREATE TABLE IF NOT EXISTS badge_definitions (
  badge_code TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon_key TEXT NOT NULL DEFAULT '',
  rule_type TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1,
  definition_version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tester_badges (
  local_id TEXT PRIMARY KEY,
  tester_id TEXT NOT NULL,
  badge_code TEXT NOT NULL,
  awarded_at INTEGER NOT NULL,
  source_event_id TEXT,
  definition_version_at_award INTEGER NOT NULL DEFAULT 1,
  sync_state TEXT NOT NULL DEFAULT 'local',
  remote_id TEXT,
  UNIQUE(tester_id, badge_code),
  FOREIGN KEY (tester_id) REFERENCES tester_profiles(local_id),
  FOREIGN KEY (badge_code) REFERENCES badge_definitions(badge_code)
);

CREATE TABLE IF NOT EXISTS community_garden_cache (
  cache_key TEXT PRIMARY KEY,
  total_community_carrots INTEGER NOT NULL DEFAULT 0,
  total_completed_tests INTEGER NOT NULL DEFAULT 0,
  milestone_payload TEXT,
  source_update_at INTEGER,
  local_retrieval_at INTEGER NOT NULL,
  stale INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS sync_outbox (
  operation_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  entity_version INTEGER NOT NULL DEFAULT 1,
  payload TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_attempt_at INTEGER,
  next_attempt_at INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  last_error TEXT,
  idempotency_key TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sync_outbox_status ON sync_outbox(status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_sync_outbox_idempotency ON sync_outbox(idempotency_key) WHERE status != 'completed';

CREATE TABLE IF NOT EXISTS sync_checkpoints (
  sync_scope TEXT PRIMARY KEY,
  remote_cursor TEXT,
  last_successful_upload_at INTEGER,
  last_successful_download_at INTEGER,
  last_attempted_sync_at INTEGER,
  last_error TEXT
);

CREATE TABLE IF NOT EXISTS sync_conflicts (
  local_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  local_version INTEGER NOT NULL,
  remote_version INTEGER NOT NULL,
  local_payload TEXT NOT NULL,
  remote_payload TEXT NOT NULL,
  detected_at INTEGER NOT NULL,
  resolution_state TEXT NOT NULL DEFAULT 'unresolved',
  resolved_at INTEGER
);
`,
};
