// ============================================================================
// WebSqliteAdapter — Real WebAssembly SQLite database engine for Browser & Dev
// ============================================================================
// Uses official SQLite compiled to WASM (sql.js).
// All queries run against a real SQLite database engine in memory,
// with state persisted to IndexedDB as a binary database file.
// ============================================================================

import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import type { DatabaseAdapter, QueryResult, RunResult } from './DatabaseAdapter';

const IDB_DB_NAME = 'OOXii_SQLite_Store';
const IDB_STORE_NAME = 'sqlite_binary_store';
const IDB_KEY = 'ooxii_db';

/**
 * Simple IndexedDB wrapper for storing the Uint8Array database blob.
 */
function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB is not supported'));
    }
    const req = indexedDB.open(IDB_DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function loadFromIDB(): Promise<Uint8Array | null> {
  if (typeof indexedDB === 'undefined') return null;
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readonly');
    const store = tx.objectStore(IDB_STORE_NAME);
    const req = store.get(IDB_KEY);
    req.onsuccess = () => {
      const val = req.result;
      if (!val) resolve(null);
      else if (val instanceof Uint8Array) resolve(val);
      else reject(new Error('Stored IndexedDB data is unreadable or corrupted'));
    };
    req.onerror = () => reject(req.error || new Error('Failed to read from IndexedDB'));
  });
}

async function saveToIDB(data: Uint8Array): Promise<void> {
  if (typeof indexedDB === 'undefined') return;
  const db = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(IDB_STORE_NAME);
    const req = store.put(data, IDB_KEY);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error || new Error('Failed to save to IndexedDB'));
  });
}

export class WebSqliteAdapter implements DatabaseAdapter {
  private SQL: SqlJsStatic | null = null;
  private db: Database | null = null;
  private inTransaction = false;
  readonly isNative = false;
  
  private isDirty = false;
  private isPersisting = false;
  private persistPromiseChain: Promise<void> = Promise.resolve();

  async open(_dbName: string): Promise<void> {
    if (!this.SQL) {
      const config: any = {};
      if (typeof window !== 'undefined' && !(window as any).process?.versions?.node) {
        config.locateFile = () => sqlWasmUrl;
      }
      this.SQL = await initSqlJs(config);
    }

    const savedBinary = await loadFromIDB();
    if (savedBinary && savedBinary.length > 0) {
      this.db = new this.SQL.Database(savedBinary);
    } else {
      this.db = new this.SQL.Database();
    }
  }

  async close(): Promise<void> {
    this.inTransaction = false;
    await this.flush();
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async flush(): Promise<void> {
    if (this.inTransaction || !this.db) return;
    this.markDirty();
    await this.persistPromiseChain;
  }

  async execute(sql: string): Promise<void> {
    this.ensureOpen();
    this.db!.exec(sql);
    this.markDirty();
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

    this.markDirty();
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
    this.markDirty();
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

  private markDirty(): void {
    if (this.inTransaction || !this.db) return;
    this.isDirty = true;
    this.schedulePersist();
  }

  private schedulePersist(): void {
    if (this.isPersisting) return;
    this.isPersisting = true;
    
    this.persistPromiseChain = this.persistPromiseChain
      .then(async () => {
        while (this.isDirty && this.db) {
          this.isDirty = false;
          const data = this.db.export();
          await saveToIDB(data);
        }
      })
      .catch((err) => {
        console.error('[WebSqliteAdapter] Persist error:', err);
        throw err;
      })
      .finally(() => {
        this.isPersisting = false;
        if (this.isDirty) {
          this.schedulePersist();
        }
      });
  }

  private ensureOpen(): void {
    if (!this.db) {
      throw new Error('WebSqliteAdapter is not open. Call open() first.');
    }
  }
}
