// ============================================================================
// SyncTransport — Interface and disabled implementation
// ============================================================================

import type { SyncTransport, SyncPushBatch, SyncPushResult, SyncPullRequest, SyncPullResult } from '../models';

export class DisabledSyncTransport implements SyncTransport {
  async push(batch: SyncPushBatch): Promise<SyncPushResult> {
    return {
      succeededIds: batch.entries.map(e => e.operationId),
      failedIds: [],
    };
  }

  async pull(request: SyncPullRequest): Promise<SyncPullResult> {
    return {
      entities: [],
      nextCursor: request.cursor,
      hasMore: false,
    };
  }

  async isAvailable(): Promise<boolean> {
    return false;
  }
}
