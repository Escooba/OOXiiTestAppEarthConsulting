// ============================================================================
// TestCompletionService — Atomic transactions for finishing a test
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { TestSessionRepository } from '../repositories/TestSessionRepository';
import type { SyncRepository } from '../repositories/SyncRepository';
import type { GamificationService } from './GamificationService';
import type { SectionType } from '../models';

export class TestCompletionService {
  constructor(
    private db: DatabaseManager,
    private sessionRepo: TestSessionRepository,
    private syncRepo: SyncRepository,
    private gamification: GamificationService
  ) {}

  /**
   * Completes a test session atomically:
   * 1. Validates session is in progress
   * 2. Saves any pending sections
   * 3. Sets status to 'completed'
   * 4. Awards carrots
   * 5. Evaluates badges
   * 6. Queues sync outbox entry
   */
  async completeTest(
    sessionId: string,
    finalSections: { type: SectionType; payload: Record<string, unknown> }[]
  ): Promise<{ carrotsAwarded: number; newBadges: string[] }> {
    return this.db.transaction(async () => {
      const session = await this.sessionRepo.getById(sessionId);
      if (!session) throw new Error('Session not found');
      if (session.status === 'completed') {
        return { carrotsAwarded: 0, newBadges: [] }; // Idempotency
      }

      // 1. Save final sections
      for (const { type, payload } of finalSections) {
        await this.sessionRepo.saveSection(sessionId, type, payload);
      }

      // 2. Set status to completed
      await this.sessionRepo.setStatus(sessionId, 'completed');

      // 3. Award Carrot (1 carrot per test completion)
      const carrotAwarded = await this.gamification.awardCarrot(
        session.testerId,
        1,
        'test_completed',
        'test_sessions',
        sessionId,
        'Completed vision test'
      );
      const carrotsAwarded = carrotAwarded ? 1 : 0;

      // 4. Evaluate badges
      const newBadges = await this.gamification.evaluateBadges(session.testerId);

      // 5. Queue sync
      await this.syncRepo.queueOperation(
        'test_sessions',
        sessionId,
        'upsert',
        JSON.stringify({ sessionId, status: 'completed' }), // Minimal payload for prototype
        session.recordVersion + 1
      );

      return { carrotsAwarded, newBadges };
    });
  }
}
