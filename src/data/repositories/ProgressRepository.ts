// ============================================================================
// ProgressRepository — carrot totals, badge progress, tester stats
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { TesterProgress, BadgeDefinition } from '../models';

export class ProgressRepository {
  constructor(private db: DatabaseManager) {}

  async getTesterProgress(testerId: string): Promise<TesterProgress> {
    // Completed tests
    const testsRows = await this.db.query<{ count: number }>(
      'SELECT COUNT(*) AS count FROM test_sessions WHERE tester_id = ? AND status = ? AND deleted_at IS NULL',
      [testerId, 'completed']
    );
    // Total carrots
    const carrotRows = await this.db.query<{ total: number | null }>(
      'SELECT SUM(quantity) AS total FROM carrot_ledger WHERE tester_id = ?',
      [testerId]
    );
    const totalCarrots = carrotRows.length > 0 ? Number(carrotRows[0].total) || 0 : 0;

    const clientRows = await this.db.query<{ count: number }>(
      'SELECT COUNT(*) AS count FROM clients WHERE created_by_tester_id = ? AND deleted_at IS NULL',
      [testerId]
    );

    const rawCompletedTests = testsRows.length > 0 ? Number(testsRows[0].count) : 0;
    const completedTests = Math.max(rawCompletedTests, totalCarrots);

    const rawClientsHelped = clientRows.length > 0 ? Number(clientRows[0].count) : 0;
    const clientsHelped = Math.max(rawClientsHelped, totalCarrots);

    // Carrots waiting to sync
    const pendingRows = await this.db.query<{ total: number | null }>(
      "SELECT SUM(quantity) AS total FROM carrot_ledger WHERE tester_id = ? AND sync_state != 'synced'",
      [testerId]
    );
    const carrotsWaitingToSync = pendingRows.length > 0 ? (Number(pendingRows[0].total) || 0) : 0;

    // Badges earned
    const badgeRows = await this.db.query<{ count: number }>(
      'SELECT COUNT(*) AS count FROM tester_badges WHERE tester_id = ?',
      [testerId]
    );
    const badgesEarned = badgeRows.length > 0 ? Number(badgeRows[0].count) : 0;

    // Distinct testing days
    const daysRows = await this.db.query<{ count: number }>(
      "SELECT COUNT(DISTINCT DATE(started_at / 1000, 'unixepoch')) AS count FROM test_sessions WHERE tester_id = ? AND status = 'completed' AND deleted_at IS NULL",
      [testerId]
    );
    const distinctTestingDays = daysRows.length > 0 ? Number(daysRows[0].count) : 0;

    // Next badge
    const earnedCodes = await this.db.query<{ badge_code: string }>(
      'SELECT badge_code FROM tester_badges WHERE tester_id = ?',
      [testerId]
    );
    const earnedSet = new Set(earnedCodes.map(r => r.badge_code));

    const allBadges = await this.db.query<BadgeDefRow>(
      'SELECT badge_code, display_name, description, icon_key, rule_type, target_value, display_order, enabled, definition_version FROM badge_definitions WHERE enabled = 1 ORDER BY display_order ASC'
    );

    let nextBadge: BadgeDefinition | null = null;
    for (const b of allBadges) {
      if (!earnedSet.has(b.badge_code)) {
        nextBadge = rowToBadgeDef(b);
        break;
      }
    }

    let progressTowardNext = 0;
    if (nextBadge) {
      if (nextBadge.ruleType === 'completed_tests') progressTowardNext = completedTests;
      else if (nextBadge.ruleType === 'clients_helped') progressTowardNext = clientsHelped;
      else if (nextBadge.ruleType === 'distinct_testing_days') progressTowardNext = distinctTestingDays;
      else progressTowardNext = completedTests; // fallback
      
      progressTowardNext = Math.min(progressTowardNext, nextBadge.targetValue);
    }
    
    const remainingForNext = nextBadge ? Math.max(0, nextBadge.targetValue - progressTowardNext) : 0;

    return {
      completedTests, clientsHelped, distinctTestingDays,
      totalCarrots, carrotsWaitingToSync, badgesEarned,
      nextBadge, progressTowardNext, remainingForNext,
    };
  }
}

interface BadgeDefRow {
  badge_code: string; display_name: string; description: string;
  icon_key: string; rule_type: string; target_value: number;
  display_order: number; enabled: number; definition_version: number;
}

function rowToBadgeDef(r: BadgeDefRow): BadgeDefinition {
  return {
    badgeCode: r.badge_code, displayName: r.display_name,
    description: r.description, iconKey: r.icon_key,
    ruleType: r.rule_type as BadgeDefinition['ruleType'],
    targetValue: r.target_value, displayOrder: r.display_order,
    enabled: r.enabled === 1, definitionVersion: r.definition_version,
  };
}
