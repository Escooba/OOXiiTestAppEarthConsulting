// ============================================================================
// GardenRepository — community garden cache and personal contribution
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { CommunityGardenCache } from '../models';
import { nowUtcMs } from '../models';

interface CacheRow {
  cache_key: string; total_community_carrots: number; total_completed_tests: number;
  milestone_payload: string | null; source_update_at: number | null;
  local_retrieval_at: number; stale: number;
}

export class GardenRepository {
  constructor(private db: DatabaseManager) {}

  async getCommunityCache(): Promise<CommunityGardenCache | null> {
    const rows = await this.db.query<CacheRow>(
      'SELECT cache_key, total_community_carrots, total_completed_tests, milestone_payload, source_update_at, local_retrieval_at, stale FROM community_garden_cache WHERE cache_key = ?',
      ['global']
    );
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      cacheKey: r.cache_key,
      totalCommunityCarrots: r.total_community_carrots,
      totalCompletedTests: r.total_completed_tests,
      milestonePayload: r.milestone_payload,
      sourceUpdateAt: r.source_update_at,
      localRetrievalAt: r.local_retrieval_at,
      stale: r.stale === 1,
    };
  }

  async updateCommunityCache(data: { totalCarrots: number; totalTests: number; milestones?: string }): Promise<void> {
    const now = nowUtcMs();
    await this.db.run(
      `INSERT OR REPLACE INTO community_garden_cache (cache_key, total_community_carrots, total_completed_tests, milestone_payload, source_update_at, local_retrieval_at, stale)
       VALUES ('global', ?, ?, ?, ?, ?, 0)`,
      [data.totalCarrots, data.totalTests, data.milestones ?? null, now, now]
    );
  }

  async getLocalCarrots(testerId: string): Promise<number> {
    const rows = await this.db.query<{ total: number | null }>(
      'SELECT SUM(quantity) AS total FROM carrot_ledger WHERE tester_id = ?',
      [testerId]
    );
    return rows.length > 0 ? (Number(rows[0].total) || 0) : 0;
  }

  async getUnsyncedCarrots(testerId: string): Promise<number> {
    const rows = await this.db.query<{ total: number | null }>(
      "SELECT SUM(quantity) AS total FROM carrot_ledger WHERE tester_id = ? AND sync_state != 'synced'",
      [testerId]
    );
    return rows.length > 0 ? (Number(rows[0].total) || 0) : 0;
  }
}
