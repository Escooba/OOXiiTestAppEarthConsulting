// ============================================================================
// GamificationService — handles carrots and badges
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { BadgeRepository } from '../repositories/BadgeRepository';
import type { TestSessionRepository } from '../repositories/TestSessionRepository';
import { generateLocalId, nowUtcMs } from '../models';
import type { CarrotEventType } from '../models';

export class GamificationService {
  constructor(
    private db: DatabaseManager,
    private badgeRepo: BadgeRepository,
    private sessionRepo: TestSessionRepository
  ) {}

  /** Award a carrot idempotently. */
  async awardCarrot(testerId: string, quantity: number, eventType: CarrotEventType, sourceEntityType: string, sourceEntityId: string, reason: string): Promise<boolean> {
    const now = nowUtcMs();
    try {
      const result = await this.db.run(
        `INSERT OR IGNORE INTO carrot_ledger (local_id, tester_id, event_type, quantity, source_entity_type, source_entity_id, reason, earned_at, created_at, sync_state)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'local')`,
        [generateLocalId(), testerId, eventType, quantity, sourceEntityType, sourceEntityId, reason, now, now]
      );
      console.log('awardCarrot result:', result);
      return (result.changes ?? 0) > 0;
    } catch (err) {
      console.log('awardCarrot error:', err);
      return false; // likely unique constraint violation
    }
  }

  /** Evaluate and award badges based on tester progress. */
  async evaluateBadges(testerId: string): Promise<string[]> {
    const newlyAwarded: string[] = [];
    const lockedBadges = await this.badgeRepo.getLockedBadges(testerId);
    if (lockedBadges.length === 0) return newlyAwarded;

    const carrotRows = await this.db.query<{ total: number | null }>(
      'SELECT SUM(quantity) AS total FROM carrot_ledger WHERE tester_id = ?',
      [testerId]
    );
    const totalCarrots = carrotRows.length > 0 ? (Number(carrotRows[0].total) || 0) : 0;

    const rawCompleted = await this.sessionRepo.getCompletedTestCount(testerId);
    const rawClients = await this.sessionRepo.getDistinctClientCount(testerId);

    const completedTests = Math.max(rawCompleted, totalCarrots);
    const distinctClients = Math.max(rawClients, totalCarrots);
    
    // Distinct testing days
    const daysRows = await this.db.query<{ count: number }>(
      "SELECT COUNT(DISTINCT DATE(started_at / 1000, 'unixepoch')) AS count FROM test_sessions WHERE tester_id = ? AND status = 'completed' AND deleted_at IS NULL",
      [testerId]
    );
    const distinctTestingDays = daysRows.length > 0 ? Number(daysRows[0].count) : 0;

    for (const badge of lockedBadges) {
      let meetsCriteria = false;
      switch (badge.ruleType) {
        case 'completed_tests':
          meetsCriteria = completedTests >= badge.targetValue;
          break;
        case 'clients_helped':
          meetsCriteria = distinctClients >= badge.targetValue;
          break;
        case 'distinct_testing_days':
          meetsCriteria = distinctTestingDays >= badge.targetValue;
          break;
        default:
          meetsCriteria = completedTests >= badge.targetValue; // fallback
      }

      if (meetsCriteria) {
        const awarded = await this.badgeRepo.awardBadge(testerId, badge.badgeCode);
        if (awarded) newlyAwarded.push(badge.badgeCode);
      }
    }

    return newlyAwarded;
  }
}
