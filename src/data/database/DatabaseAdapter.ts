// ============================================================================
// Database Adapter Interface — abstraction over native SQLite and dev adapters
// ============================================================================

export interface QueryResult {
  values?: unknown[][];
}

export interface RunResult {
  changes?: number;
  lastInsertRowid?: number;
}

export interface DatabaseAdapter {
  /** Open (or create) the database. */
  open(dbName: string): Promise<void>;

  /** Close the database. */
  close(): Promise<void>;

  /** Execute a statement with no return (DDL, pragma, etc.). */
  execute(sql: string): Promise<void>;

  /** Execute parameterised SQL returning rows. Each row is an array of values. */
  query(sql: string, params?: unknown[]): Promise<QueryResult>;

  /** Execute parameterised SQL for inserts/updates/deletes. */
  run(sql: string, params?: unknown[]): Promise<RunResult>;

  /** Begin a transaction. */
  beginTransaction(): Promise<void>;

  /** Commit the current transaction. */
  commitTransaction(): Promise<void>;

  /** Roll back the current transaction. */
  rollbackTransaction(): Promise<void>;

  /** Whether this adapter is the native production implementation. */
  readonly isNative: boolean;
}
