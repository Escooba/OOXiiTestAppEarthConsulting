// ============================================================================
// Migration 002 — Seed badge definitions
// ============================================================================

import type { Migration } from './types';

export const migration002: Migration = {
  version: 2,
  name: 'seed_badge_definitions',
  up: `
INSERT OR REPLACE INTO badge_definitions (badge_code, display_name, description, icon_key, rule_type, target_value, display_order, enabled, definition_version) VALUES ('FIRST_VISION', 'First Vision', 'Complete your first client test', '👁️', 'completed_tests', 1, 1, 1, 1);
INSERT OR REPLACE INTO badge_definitions (badge_code, display_name, description, icon_key, rule_type, target_value, display_order, enabled, definition_version) VALUES ('TEN_HELPERS', 'Ten Helpers', 'Complete 10 client tests', '⭐', 'completed_tests', 10, 2, 1, 1);
INSERT OR REPLACE INTO badge_definitions (badge_code, display_name, description, icon_key, rule_type, target_value, display_order, enabled, definition_version) VALUES ('VISION_GUIDE', 'Vision Guide', 'Complete 50 client tests', '🔭', 'completed_tests', 50, 3, 1, 1);
INSERT OR REPLACE INTO badge_definitions (badge_code, display_name, description, icon_key, rule_type, target_value, display_order, enabled, definition_version) VALUES ('COMMUNITY_PILLAR', 'Community Pillar', 'Complete 100 client tests', '🏛️', 'completed_tests', 100, 4, 1, 1);
INSERT OR REPLACE INTO badge_definitions (badge_code, display_name, description, icon_key, rule_type, target_value, display_order, enabled, definition_version) VALUES ('FIELD_CHAMPION', 'Field Champion', 'Complete 200 client tests', '🏆', 'completed_tests', 200, 5, 1, 1);
INSERT OR REPLACE INTO badge_definitions (badge_code, display_name, description, icon_key, rule_type, target_value, display_order, enabled, definition_version) VALUES ('VISION_LEGEND', 'Vision Legend', 'Complete 500 client tests', '⚡', 'completed_tests', 500, 6, 1, 1);

INSERT OR REPLACE INTO community_garden_cache (cache_key, total_community_carrots, total_completed_tests, milestone_payload, source_update_at, local_retrieval_at, stale)
VALUES ('global', 0, 0, NULL, NULL, 0, 1);
`,
};
