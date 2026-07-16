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

    const completedTests = await this.sessionRepo.getCompletedTestCount(testerId);
    const distinctClients = await this.sessionRepo.getDistinctClientCount(testerId);

    for (const badge of lockedBadges) {
      let meetsCriteria = false;
      switch (badge.ruleType) {
        case 'completed_tests':
          meetsCriteria = completedTests >= badge.targetValue;
          break;
        case 'clients_helped':
          meetsCriteria = distinctClients >= badge.targetValue;
          break;
        // other rule types omitted for prototype simplicity
      }

      if (meetsCriteria) {
        const awarded = await this.badgeRepo.awardBadge(testerId, badge.badgeCode);
        if (awarded) newlyAwarded.push(badge.badgeCode);
      }
    }

    return newlyAwarded;
  }
}
