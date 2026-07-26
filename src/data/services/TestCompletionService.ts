// ============================================================================
// TestCompletionService — Atomic transactions for finishing a test
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { TestSessionRepository } from '../repositories/TestSessionRepository';
import type { SyncRepository } from '../repositories/SyncRepository';
import type { GamificationService } from './GamificationService';
import type { SectionType } from '../models';
import { generateLocalId, nowUtcMs } from '../models';

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

      // 2. Structured data extraction (Idempotent)
      await this.db.run(`DELETE FROM visual_acuity_measurements WHERE test_session_id = ?`, [sessionId]);
      await this.db.run(`DELETE FROM prescriptions WHERE test_session_id = ?`, [sessionId]);
      await this.db.run(`DELETE FROM dispensed_items WHERE test_session_id = ?`, [sessionId]);
      await this.db.run(`DELETE FROM completion_checklist_items WHERE test_session_id = ?`, [sessionId]);

      const allSections = await this.sessionRepo.getAllSections(sessionId);
      const payload: any = {};
      for (const sec of allSections) Object.assign(payload, sec.payload);
      
      const now = nowUtcMs();

      // Example: visual acuity (Right Distance No Glasses)
      if (payload.distanceRightLine) {
        await this.db.run(
          `INSERT INTO visual_acuity_measurements (local_id, test_session_id, phase, test_method, eye_context, correction_context, ooxii_line, snellen_metres, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [generateLocalId(), sessionId, 'pretest', 'ooxii_chart', 'right', 'no_glasses', payload.distanceRightLine, payload.rightDistanceNoGlasses, now, now]
        );
      }
      if (payload.distanceLeftLine) {
        await this.db.run(
          `INSERT INTO visual_acuity_measurements (local_id, test_session_id, phase, test_method, eye_context, correction_context, ooxii_line, snellen_metres, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [generateLocalId(), sessionId, 'pretest', 'ooxii_chart', 'left', 'no_glasses', payload.distanceLeftLine, payload.leftDistanceNoGlasses, now, now]
        );
      }
      
      // Prescriptions (Right)
      if (payload.wheelRightPower) {
        await this.db.run(
          `INSERT INTO prescriptions (local_id, test_session_id, eye_side, prescription_mode, sphere, lens_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [generateLocalId(), sessionId, 'right', 'distance', payload.wheelRightPower, 'spherical', now, now]
        );
      }
      // Prescriptions (Left)
      if (payload.wheelLeftPower) {
        await this.db.run(
          `INSERT INTO prescriptions (local_id, test_session_id, eye_side, prescription_mode, sphere, lens_type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [generateLocalId(), sessionId, 'left', 'distance', payload.wheelLeftPower, 'spherical', now, now]
        );
      }

      // Dispensed items
      if (payload.sunglassesType) {
         await this.db.run(
           `INSERT INTO dispensed_items (local_id, test_session_id, item_category, frame_type, dispensed, price_cents, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
           [generateLocalId(), sessionId, 'sunglasses', payload.sunglassesType, 1, (payload.totalPaid || 0) * 100, now, now]
         );
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
