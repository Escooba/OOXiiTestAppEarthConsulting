// ============================================================================
// WebSqliteAdapter — Real WebAssembly SQLite database engine for Browser & Dev
// ============================================================================
// Uses official SQLite compiled to WASM (sql.js).
// All queries run against a real SQLite database engine in memory,
// with state persisted to localStorage as a binary database file.
// ============================================================================

import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import type { DatabaseAdapter, QueryResult, RunResult } from './DatabaseAdapter';

const STORAGE_KEY = 'ooxii_sqlite_db_binary';

export class WebSqliteAdapter implements DatabaseAdapter {
  private SQL: SqlJsStatic | null = null;
  private db: Database | null = null;
  private inTransaction = false;
  readonly isNative = false;

  async open(_dbName: string): Promise<void> {
    if (!this.SQL) {
      const config: any = {};
      if (typeof window !== 'undefined' && !(window as any).process?.versions?.node) {
        config.locateFile = () => sqlWasmUrl;
      }
      this.SQL = await initSqlJs(config);
    }

    let loaded = false;
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const binary = Uint8Array.from(atob(saved), (c) => c.charCodeAt(0));
          this.db = new this.SQL.Database(binary);
          loaded = true;
        }
      } catch (err) {
        console.warn('[WebSqliteAdapter] Failed to restore database from localStorage:', err);
      }
    }

    if (!loaded) {
      this.db = new this.SQL.Database();
    }
  }

  async close(): Promise<void> {
    this.inTransaction = false;
    this.persist();
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async execute(sql: string): Promise<void> {
    this.ensureOpen();
    this.db!.exec(sql);
    this.persist();
  }

  async query(sql: string, params?: unknown[]): Promise<QueryResult> {
    this.ensureOpen();
    const res = this.db!.exec(sql, this.formatParams(params));
    if (!res || res.length === 0) return { values: [] };
    return { values: res[0].values };
  }

  async run(sql: string, params?: unknown[]): Promise<RunResult> {
    this.ensureOpen();
    this.db!.run(sql, this.formatParams(params));
    
    // Get row count changes & last insert rowid
    const changesRes = this.db!.exec('SELECT changes(), last_insert_rowid()');
    let changes = 0;
    let lastInsertRowid: number | undefined;
    if (changesRes && changesRes.length > 0 && changesRes[0].values.length > 0) {
      changes = Number(changesRes[0].values[0][0]) || 0;
      const lastId = Number(changesRes[0].values[0][1]);
      if (!isNaN(lastId) && lastId > 0) {
        lastInsertRowid = lastId;
      }
    }

    this.persist();
    return { changes, lastInsertRowid };
  }

  async beginTransaction(): Promise<void> {
    this.ensureOpen();
    this.inTransaction = true;
    this.db!.exec('BEGIN TRANSACTION;');
  }

  async commitTransaction(): Promise<void> {
    this.ensureOpen();
    this.db!.exec('COMMIT;');
    this.inTransaction = false;
    this.persist();
  }

  async rollbackTransaction(): Promise<void> {
    this.ensureOpen();
    try {
      this.db!.exec('ROLLBACK;');
    } catch {
      // Ignore if no transaction active
    } finally {
      this.inTransaction = false;
    }
  }

  private formatParams(params?: unknown[]): (string | number | null | Uint8Array)[] | undefined {
    if (!params || params.length === 0) return undefined;
    return params.map((p) => {
      if (p === undefined || p === null) return null;
      if (typeof p === 'boolean') return p ? 1 : 0;
      if (typeof p === 'number') return p;
      return String(p);
    });
  }

  private persist(): void {
    if (this.inTransaction || !this.db || typeof localStorage === 'undefined') return;
    try {
      const data = this.db.export();
      let binary = '';
      const len = data.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(data[i]);
      }
      localStorage.setItem(STORAGE_KEY, btoa(binary));
    } catch (err) {
      console.warn('[WebSqliteAdapter] Failed to persist database:', err);
    }
  }

  private ensureOpen(): void {
    if (!this.db) {
      throw new Error('WebSqliteAdapter is not open. Call open() first.');
    }
  }
}
