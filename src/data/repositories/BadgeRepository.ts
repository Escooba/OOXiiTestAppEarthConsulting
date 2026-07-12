// ============================================================================
// BadgeRepository — definitions, earned badges, award logic
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { BadgeDefinition, TesterBadge, SyncState, BadgeRuleType } from '../models';
import { generateLocalId, nowUtcMs } from '../models';

interface BadgeDefRow {
  badge_code: string; display_name: string; description: string;
  icon_key: string; rule_type: string; target_value: number;
  display_order: number; enabled: number; definition_version: number;
}

interface BadgeRow {
  local_id: string; tester_id: string; badge_code: string;
  awarded_at: number; source_event_id: string | null;
  definition_version_at_award: number; sync_state: string; remote_id: string | null;
}

function rowToDef(r: BadgeDefRow): BadgeDefinition {
  return {
    badgeCode: r.badge_code, displayName: r.display_name, description: r.description,
    iconKey: r.icon_key, ruleType: r.rule_type as BadgeRuleType,
    targetValue: r.target_value, displayOrder: r.display_order,
    enabled: r.enabled === 1, definitionVersion: r.definition_version,
  };
}

function rowToBadge(r: BadgeRow): TesterBadge {
  return {
    localId: r.local_id, testerId: r.tester_id, badgeCode: r.badge_code,
    awardedAt: r.awarded_at, sourceEventId: r.source_event_id,
    definitionVersionAtAward: r.definition_version_at_award,
    syncState: r.sync_state as SyncState, remoteId: r.remote_id,
  };
}

export class BadgeRepository {
  constructor(private db: DatabaseManager) {}

  async getAllDefinitions(): Promise<BadgeDefinition[]> {
    const rows = await this.db.query<BadgeDefRow>(
      'SELECT badge_code, display_name, description, icon_key, rule_type, target_value, display_order, enabled, definition_version FROM badge_definitions WHERE enabled = 1 ORDER BY display_order ASC'
    );
    return rows.map(rowToDef);
  }

  async getEarnedBadges(testerId: string): Promise<TesterBadge[]> {
    const rows = await this.db.query<BadgeRow>(
      'SELECT local_id, tester_id, badge_code, awarded_at, source_event_id, definition_version_at_award, sync_state, remote_id FROM tester_badges WHERE tester_id = ? ORDER BY awarded_at ASC',
      [testerId]
    );
    return rows.map(rowToBadge);
  }

  async hasBadge(testerId: string, badgeCode: string): Promise<boolean> {
    const rows = await this.db.query<{ count: number }>(
      'SELECT COUNT(*) AS count FROM tester_badges WHERE tester_id = ? AND badge_code = ?',
      [testerId, badgeCode]
    );
    return rows.length > 0 && Number(rows[0].count) > 0;
  }

  /** Idempotently award a badge. Returns true if newly awarded. */
  async awardBadge(testerId: string, badgeCode: string, sourceEventId?: string): Promise<boolean> {
    if (await this.hasBadge(testerId, badgeCode)) return false;

    // Get definition version
    const defs = await this.db.query<BadgeDefRow>(
      'SELECT badge_code, display_name, description, icon_key, rule_type, target_value, display_order, enabled, definition_version FROM badge_definitions WHERE badge_code = ?',
      [badgeCode]
    );
    const defVersion = defs.length > 0 ? defs[0].definition_version : 1;

    await this.db.run(
      `INSERT OR IGNORE INTO tester_badges (local_id, tester_id, badge_code, awarded_at, source_event_id, definition_version_at_award, sync_state)
       VALUES (?, ?, ?, ?, ?, ?, 'local')`,
      [generateLocalId(), testerId, badgeCode, nowUtcMs(), sourceEventId ?? null, defVersion]
    );
    return true;
  }

  /** Get badges that are locked (not yet earned). */
  async getLockedBadges(testerId: string): Promise<BadgeDefinition[]> {
    const all = await this.getAllDefinitions();
    const earned = await this.getEarnedBadges(testerId);
    const earnedSet = new Set(earned.map(b => b.badgeCode));
    return all.filter(d => !earnedSet.has(d.badgeCode));
  }
}
