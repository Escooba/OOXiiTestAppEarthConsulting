// ============================================================================
// DatabaseManager — orchestrates adapter, migrations, and provides typed API
// ============================================================================

import type { DatabaseAdapter, QueryResult, RunResult } from './DatabaseAdapter';
import { migration001, migration002, migration003, migration004, migration005, migration006, migration007, migration008 } from './migrations';
import type { Migration } from './migrations';
import { generateLocalId, nowUtcMs } from '../models';

const DB_NAME = 'ooxii_vision';

const ALL_MIGRATIONS: Migration[] = [migration001, migration002, migration003, migration004, migration005, migration006, migration007, migration008];

export type DatabaseState = 'uninitialised' | 'initialising' | 'ready' | 'error';

export class DatabaseManager {
  private adapter: DatabaseAdapter;
  private _state: DatabaseState = 'uninitialised';
  private _error: string | null = null;

  constructor(adapter: DatabaseAdapter) {
    this.adapter = adapter;
  }

  get state(): DatabaseState { return this._state; }
  get error(): string | null { return this._error; }
  get isNative(): boolean { return this.adapter.isNative; }

  /** Initialise: open db, enable FK, run migrations, seed data. */
  async initialise(): Promise<void> {
    if (this._state === 'ready') return;
    this._state = 'initialising';

    try {
      await this.adapter.open(DB_NAME);

      // Enable foreign keys
      await this.adapter.execute('PRAGMA foreign_keys = ON;');

      // Ensure schema_migrations table exists (in case this is a fresh db)
      await this.adapter.execute(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          applied_at INTEGER NOT NULL,
          checksum TEXT
        );
      `);

      // Run pending migrations
      await this.runMigrations();

      // Ensure app_metadata exists
      await this.ensureAppMetadata();

      // Update last opened
      await this.adapter.run(
        'UPDATE app_metadata SET last_opened_at = ?',
        [nowUtcMs()]
      );

      this._state = 'ready';
    } catch (err) {
      this._state = 'error';
      this._error = err instanceof Error ? err.message : String(err);
      // Do NOT reset the database. Preserve it for recovery.
      console.error('[DatabaseManager] Initialisation failed:', this._error);
      throw err;
    }
  }

  /** Execute a statement (DDL, pragma). */
  async execute(sql: string): Promise<void> {
    this.ensureReady();
    return this.adapter.execute(sql);
  }

  /** Parameterised query returning rows. */
  async query<T = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<T[]> {
    this.ensureReady();
    const result = await this.adapter.query(sql, params);
    return this.resultToObjects<T>(sql, result);
  }

  /** Parameterised insert/update/delete. */
  async run(sql: string, params?: unknown[]): Promise<RunResult> {
    this.ensureReady();
    return this.adapter.run(sql, params);
  }

  /** Execute a callback within a transaction. Rolls back on any error. */
  async transaction<T>(fn: () => Promise<T>): Promise<T> {
    this.ensureReady();
    await this.adapter.beginTransaction();
    try {
      const result = await fn();
      await this.adapter.commitTransaction();
      return result;
    } catch (err) {
      await this.adapter.rollbackTransaction();
      throw err;
    }
  }

  async close(): Promise<void> {
    await this.adapter.close();
    this._state = 'uninitialised';
  }

  // ---------------------------------------------------------------------------
  // Private
  // ---------------------------------------------------------------------------

  private async runMigrations(): Promise<void> {
    const applied = await this.getAppliedVersions();

    for (const migration of ALL_MIGRATIONS) {
      if (applied.has(migration.version)) continue;

      try {
        await this.adapter.execute(migration.up);

        // Record the migration
        await this.adapter.run(
          'INSERT OR IGNORE INTO schema_migrations (version, name, applied_at, checksum) VALUES (?, ?, ?, ?)',
          [migration.version, migration.name, nowUtcMs(), null]
        );
      } catch (err) {
        const msg = `Migration ${migration.version} (${migration.name}) failed: ${err instanceof Error ? err.message : err}`;
        console.error('[DatabaseManager]', msg);
        throw new Error(msg);
      }
    }
  }

  private async getAppliedVersions(): Promise<Set<number>> {
    try {
      const result = await this.adapter.query('SELECT version FROM schema_migrations');
      const versions = new Set<number>();
      if (result.values) {
        for (const row of result.values) {
          versions.add(Number(row[0]));
        }
      }
      return versions;
    } catch {
      return new Set();
    }
  }

  private async ensureAppMetadata(): Promise<void> {
    const result = await this.adapter.query('SELECT installation_id FROM app_metadata LIMIT 1');
    if (!result.values || result.values.length === 0) {
      const now = nowUtcMs();
      await this.adapter.run(
        'INSERT INTO app_metadata (installation_id, db_schema_version, created_at, last_opened_at) VALUES (?, ?, ?, ?)',
        [generateLocalId(), ALL_MIGRATIONS.length, now, now]
      );
    }
  }

  private ensureReady(): void {
    if (this._state !== 'ready') {
      throw new Error(`DatabaseManager is not ready (state: ${this._state}). Call initialise() first.`);
    }
  }

  /** Convert raw query results to typed objects. Extracts column names from SQL. */
  private resultToObjects<T>(sql: string, result: QueryResult): T[] {
    if (!result.values || result.values.length === 0) return [];

    // Try to extract column names from SELECT clause
    const columns = this.extractColumnNames(sql);
    if (columns.length === 0) {
      // Fall back: use index-based keys
      return result.values.map(row => {
        const obj: Record<string, unknown> = {};
        row.forEach((val, i) => { obj[`col${i}`] = val; });
        return obj as T;
      });
    }

    return result.values.map(row => {
      const obj: Record<string, unknown> = {};
      columns.forEach((col, i) => {
        obj[col] = row[i] ?? null;
      });
      return obj as T;
    });
  }

  private extractColumnNames(sql: string): string[] {
    const match = sql.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
    if (!match) return [];
    const selectPart = match[1].trim();
    if (selectPart === '*') return []; // Can't determine columns from *

    return selectPart.split(',').map(col => {
      const trimmed = col.trim();
      // Handle aliases: "column AS alias"
      const aliasMatch = trimmed.match(/\s+AS\s+(\w+)$/i);
      if (aliasMatch) return aliasMatch[1];
      // Handle aggregates: "COUNT(*)" etc
      const funcMatch = trimmed.match(/(\w+)\s*\(/);
      if (funcMatch) return funcMatch[0].replace(/\(.*/, '').toLowerCase();
      // Handle table.column
      const dotMatch = trimmed.match(/\.(\w+)$/);
      if (dotMatch) return dotMatch[1];
      // Plain column
      return trimmed;
    });
  }
}
