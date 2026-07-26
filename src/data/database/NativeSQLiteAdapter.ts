// ============================================================================
// Native SQLite Adapter — production adapter using @capacitor-community/sqlite
// ============================================================================

import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';
import type { DatabaseAdapter, QueryResult, RunResult } from './DatabaseAdapter';

export class NativeSQLiteAdapter implements DatabaseAdapter {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  readonly isNative = true;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async open(dbName: string): Promise<void> {
    // Manage encryption secret
    const SECRET_KEY = 'ooxii_db_passphrase';
    let secret = (await Preferences.get({ key: SECRET_KEY })).value;
    if (!secret) {
      secret = 'ooxii_' + Date.now().toString(36) + Math.random().toString(36).substring(2);
      await Preferences.set({ key: SECRET_KEY, value: secret });
    }

    try {
      await this.sqlite.setEncryptionSecret(secret);
    } catch (e) {
      console.warn('Failed to set encryption secret (may already be set):', e);
    }

    // Check connection consistency
    const retCC = await this.sqlite.checkConnectionsConsistency();
    const isConn = (await this.sqlite.isConnection(dbName, false)).result;

    if (retCC.result && isConn) {
      this.db = await this.sqlite.retrieveConnection(dbName, false);
    } else {
      this.db = await this.sqlite.createConnection(
        dbName,
        true, // encrypted
        'encryption', // mode
        1, // version
        false, // readonly
      );
    }
    await this.db.open();
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  async execute(sql: string): Promise<void> {
    this.ensureOpen();
    await this.db!.execute(sql);
  }

  async query(sql: string, params?: unknown[]): Promise<QueryResult> {
    this.ensureOpen();
    const result = await this.db!.query(sql, params as (string | number | null)[] | undefined);
    // The plugin returns { values: Array<Record<string,any>> }
    // Convert to array-of-arrays for consistency
    if (!result.values || result.values.length === 0) {
      return { values: [] };
    }
    // result.values is an array of objects with column names as keys
    const rows = result.values as Record<string, unknown>[];
    const columns = Object.keys(rows[0]);
    const values = rows.map(row => columns.map(col => row[col]));
    return { values };
  }

  async run(sql: string, params?: unknown[]): Promise<RunResult> {
    this.ensureOpen();
    const result = await this.db!.run(sql, params as (string | number | null)[] | undefined);
    return {
      changes: result.changes?.changes ?? 0,
      lastInsertRowid: result.changes?.lastId ?? undefined,
    };
  }

  async beginTransaction(): Promise<void> {
    this.ensureOpen();
    await this.db!.execute('BEGIN TRANSACTION;');
  }

  async commitTransaction(): Promise<void> {
    this.ensureOpen();
    await this.db!.execute('COMMIT;');
  }

  async rollbackTransaction(): Promise<void> {
    this.ensureOpen();
    try {
      await this.db!.execute('ROLLBACK;');
    } catch {
      // Swallow if no active transaction
    }
  }

  private ensureOpen(): void {
    if (!this.db) {
      throw new Error('NativeSQLiteAdapter: database is not open. Call open() first.');
    }
  }
}
