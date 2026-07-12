// ============================================================================
// SyncRepository — outbox queue, checkpoints, conflicts
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { SyncOutboxEntry, SyncCheckpoint, SyncConflict, SyncOperationType, SyncOperationStatus, SyncConflictResolution } from '../models';
import { generateLocalId, nowUtcMs } from '../models';

interface OutboxRow {
  operation_id: string; entity_type: string; entity_id: string;
  operation_type: string; entity_version: number; payload: string;
  created_at: number; attempt_count: number; last_attempt_at: number | null;
  next_attempt_at: number | null; status: string; last_error: string | null;
  idempotency_key: string;
}

interface CheckpointRow {
  sync_scope: string; remote_cursor: string | null;
  last_successful_upload_at: number | null;
  last_successful_download_at: number | null;
  last_attempted_sync_at: number | null;
  last_error: string | null;
}

function rowToOutbox(r: OutboxRow): SyncOutboxEntry {
  return {
    operationId: r.operation_id, entityType: r.entity_type,
    entityId: r.entity_id, operationType: r.operation_type as SyncOperationType,
    entityVersion: r.entity_version, payload: r.payload,
    createdAt: r.created_at, attemptCount: r.attempt_count,
    lastAttemptAt: r.last_attempt_at, nextAttemptAt: r.next_attempt_at,
    status: r.status as SyncOperationStatus, lastError: r.last_error,
    idempotencyKey: r.idempotency_key,
  };
}

function rowToCheckpoint(r: CheckpointRow): SyncCheckpoint {
  return {
    syncScope: r.sync_scope, remoteCursor: r.remote_cursor,
    lastSuccessfulUploadAt: r.last_successful_upload_at,
    lastSuccessfulDownloadAt: r.last_successful_download_at,
    lastAttemptedSyncAt: r.last_attempted_sync_at,
    lastError: r.last_error,
  };
}

export class SyncRepository {
  constructor(private db: DatabaseManager) {}

  async queueOperation(entityType: string, entityId: string, operationType: SyncOperationType, payload: string, entityVersion: number): Promise<void> {
    const now = nowUtcMs();
    const idempotencyKey = `${entityType}:${entityId}:${operationType}:${entityVersion}`;
    await this.db.run(
      `INSERT OR IGNORE INTO sync_outbox (operation_id, entity_type, entity_id, operation_type, entity_version, payload, created_at, status, idempotency_key)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [generateLocalId(), entityType, entityId, operationType, entityVersion, payload, now, idempotencyKey]
    );
  }

  async getPendingBatch(limit = 50): Promise<SyncOutboxEntry[]> {
    const rows = await this.db.query<OutboxRow>(
      'SELECT operation_id, entity_type, entity_id, operation_type, entity_version, payload, created_at, attempt_count, last_attempt_at, next_attempt_at, status, last_error, idempotency_key FROM sync_outbox WHERE status = ? ORDER BY created_at ASC LIMIT ?',
      ['pending', limit]
    );
    return rows.map(rowToOutbox);
  }

  async markAttempted(operationId: string, error?: string): Promise<void> {
    const now = nowUtcMs();
    if (error) {
      await this.db.run(
        'UPDATE sync_outbox SET attempt_count = attempt_count + 1, last_attempt_at = ?, last_error = ?, status = ? WHERE operation_id = ?',
        [now, error, 'failed', operationId]
      );
    } else {
      await this.db.run(
        'UPDATE sync_outbox SET attempt_count = attempt_count + 1, last_attempt_at = ?, status = ? WHERE operation_id = ?',
        [now, 'completed', operationId]
      );
    }
  }

  async getCheckpoint(scope: string): Promise<SyncCheckpoint | null> {
    const rows = await this.db.query<CheckpointRow>(
      'SELECT sync_scope, remote_cursor, last_successful_upload_at, last_successful_download_at, last_attempted_sync_at, last_error FROM sync_checkpoints WHERE sync_scope = ?',
      [scope]
    );
    return rows.length > 0 ? rowToCheckpoint(rows[0]) : null;
  }

  async saveCheckpoint(checkpoint: SyncCheckpoint): Promise<void> {
    await this.db.run(
      `INSERT OR REPLACE INTO sync_checkpoints (sync_scope, remote_cursor, last_successful_upload_at, last_successful_download_at, last_attempted_sync_at, last_error)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [checkpoint.syncScope, checkpoint.remoteCursor, checkpoint.lastSuccessfulUploadAt, checkpoint.lastSuccessfulDownloadAt, checkpoint.lastAttemptedSyncAt, checkpoint.lastError]
    );
  }

  async getPendingCount(): Promise<number> {
    const rows = await this.db.query<{ count: number }>(
      'SELECT COUNT(*) AS count FROM sync_outbox WHERE status = ?',
      ['pending']
    );
    return rows.length > 0 ? Number(rows[0].count) : 0;
  }
}
