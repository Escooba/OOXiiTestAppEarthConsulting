// ============================================================================
// SyncCoordinator — Manages sync lifecycle using transport layer
// ============================================================================

import type { SyncRepository } from '../repositories/SyncRepository';
import type { SyncTransport } from '../models';

export class SyncCoordinator {
  private isSyncing = false;

  constructor(
    private syncRepo: SyncRepository,
    private transport: SyncTransport
  ) {}

  async syncAll(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const available = await this.transport.isAvailable();
      if (!available) return;

      // 1. Push pending changes
      await this.pushPending();

      // 2. Pull remote changes (mocked/omitted for offline prototype)
      // await this.pullRemote();
    } finally {
      this.isSyncing = false;
    }
  }

  private async pushPending(): Promise<void> {
    const batch = await this.syncRepo.getPendingBatch(50);
    if (batch.length === 0) return;

    try {
      const result = await this.transport.push({ entries: batch });
      
      for (const id of result.succeededIds) {
        await this.syncRepo.markAttempted(id);
      }
      for (const { id, error } of result.failedIds) {
        await this.syncRepo.markAttempted(id, error);
      }
    } catch (err) {
      console.error('[SyncCoordinator] Push failed', err);
      // Mark all as failed this round
      for (const entry of batch) {
        await this.syncRepo.markAttempted(entry.operationId, String(err));
      }
    }
  }
}
