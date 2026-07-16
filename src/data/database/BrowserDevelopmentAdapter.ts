// ============================================================================
// Browser Development Adapter — localStorage-backed adapter for dev/preview
// ============================================================================
// WARNING: This adapter is for DEVELOPMENT ONLY. It must NOT be the production
// persistence mechanism on Android. It stores data in localStorage as JSON
// and uses a simple in-memory table representation.
// ============================================================================

import type { DatabaseAdapter, QueryResult, RunResult } from './DatabaseAdapter';

type Row = Record<string, unknown>;
type Table = Row[];

interface DBState {
  tables: Record<string, Table>;
  schemas: Record<string, string[]>; // table -> column names
}

const STORAGE_KEY = 'ooxii_dev_db';

/**
 * Minimal SQL parser for development use only.
 * Supports: CREATE TABLE, INSERT, SELECT, UPDATE, DELETE, DROP, BEGIN/COMMIT/ROLLBACK.
 * NOT a full SQL engine — designed only to support the OOXii repository interface.
 */
export class BrowserDevelopmentAdapter implements DatabaseAdapter {
  private state: DBState = { tables: {}, schemas: {} };
  private inTransaction = false;
  private transactionSnapshot: string | null = null;
  readonly isNative = false;

  async open(_dbName: string): Promise<void> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.state = JSON.parse(stored);
      }
    } catch {
      this.state = { tables: {}, schemas: {} };
    }
  }

  async close(): Promise<void> {
    this.persist();
  }

  async execute(sql: string): Promise<void> {
    // Handle multi-statement SQL by splitting on semicolons
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    for (const stmt of statements) {
      this.executeOne(stmt);
    }
    this.persist();
  }

  async query(sql: string, params?: unknown[]): Promise<QueryResult> {
    const resolved = this.resolveParams(sql, params);
    const result = this.executeSelect(resolved);
    return { values: result };
  }

  async run(sql: string, params?: unknown[]): Promise<RunResult> {
    const resolved = this.resolveParams(sql, params);
    const changes = this.executeDML(resolved);
    this.persist();
    return { changes };
  }

  async beginTransaction(): Promise<void> {
    this.transactionSnapshot = JSON.stringify(this.state);
    this.inTransaction = true;
  }

  async commitTransaction(): Promise<void> {
    this.inTransaction = false;
    this.transactionSnapshot = null;
    this.persist();
  }

  async rollbackTransaction(): Promise<void> {
    if (this.transactionSnapshot) {
      this.state = JSON.parse(this.transactionSnapshot);
    }
    this.inTransaction = false;
    this.transactionSnapshot = null;
    this.persist();
  }

  // -------------------------------------------------------------------------
  // Internal
  // -------------------------------------------------------------------------

  private resolveParams(sql: string, params?: unknown[]): string {
    if (!params || params.length === 0) return sql;
    let idx = 0;
    return sql.replace(/\?/g, () => {
      const val = params[idx++];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return String(val);
      if (typeof val === 'boolean') return val ? '1' : '0';
      // Escape single quotes for string values
      return `'${String(val).replace(/'/g, "''")}'`;
    });
  }

  private executeOne(sql: string): void {
    const upper = sql.toUpperCase().trim();
    if (upper.startsWith('PRAGMA')) return;
    if (upper.startsWith('CREATE TABLE') || upper.startsWith('CREATE TABLE IF NOT EXISTS')) {
      this.executeCreateTable(sql);
    } else if (upper.startsWith('CREATE UNIQUE INDEX') || upper.startsWith('CREATE INDEX')) {
      // Indexes are no-ops in the dev adapter
      return;
    } else if (upper.startsWith('DROP TABLE')) {
      const match = sql.match(/DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(\w+)/i);
      if (match) {
        delete this.state.tables[match[1]];
        delete this.state.schemas[match[1]];
      }
    } else if (upper.startsWith('INSERT') || upper.startsWith('REPLACE')) {
      this.executeDML(sql);
    } else if (upper.startsWith('UPDATE')) {
      this.executeDML(sql);
    } else if (upper.startsWith('DELETE')) {
      this.executeDML(sql);
    } else if (upper.startsWith('BEGIN') || upper.startsWith('COMMIT') || upper.startsWith('ROLLBACK')) {
      return;
    }
  }

  private executeCreateTable(sql: string): void {
    const match = sql.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)\s*\(([\s\S]+)\)/i);
    if (!match) return;
    const tableName = match[1];
    const body = match[2];

    // Extract column names (skip constraints like PRIMARY KEY, UNIQUE, FOREIGN KEY, CHECK)
    const columns: string[] = [];
    const parts = this.splitColumnDefs(body);
    for (const part of parts) {
      const trimmed = part.trim();
      const upperPart = trimmed.toUpperCase();
      if (upperPart.startsWith('PRIMARY KEY') ||
          upperPart.startsWith('UNIQUE') ||
          upperPart.startsWith('FOREIGN KEY') ||
          upperPart.startsWith('CHECK') ||
          upperPart.startsWith('CONSTRAINT')) {
        continue;
      }
      const colMatch = trimmed.match(/^(\w+)/);
      if (colMatch) columns.push(colMatch[1]);
    }

    if (!this.state.tables[tableName]) {
      this.state.tables[tableName] = [];
      this.state.schemas[tableName] = columns;
    }
  }

  private splitColumnDefs(body: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    for (const char of body) {
      if (char === '(') depth++;
      else if (char === ')') depth--;
      else if (char === ',' && depth === 0) {
        parts.push(current);
        current = '';
        continue;
      }
      current += char;
    }
    if (current.trim()) parts.push(current);
    return parts;
  }

  private executeSelect(sql: string): unknown[][] {
    const match = sql.match(/SELECT\s+([\s\S]+?)\s+FROM\s+(\w+)([\s\S]*)/i);
    if (!match) return [];

    const selectPart = match[1].trim();
    const tableName = match[2];
    const rest = match[3]?.trim() || '';
    const table = this.state.tables[tableName] || [];

    // Apply WHERE filter
    let rows = this.applyWhere(table, rest);

    // Apply ORDER BY
    rows = this.applyOrderBy(rows, rest);

    // Apply LIMIT
    rows = this.applyLimit(rows, rest);

    // Build column projection
    if (selectPart === '*') {
      const columns = this.state.schemas[tableName] || (rows.length > 0 ? Object.keys(rows[0]) : []);
      return rows.map(r => columns.map(c => r[c] ?? null));
    }

    // Handle COUNT(*) and other aggregate functions
    if (/^COUNT\s*\(\s*\*\s*\)/i.test(selectPart)) {
      return [[rows.length]];
    }

    if (/^COUNT\s*\(\s*DISTINCT\s+(\w+)\s*\)/i.test(selectPart)) {
      const colMatch = selectPart.match(/^COUNT\s*\(\s*DISTINCT\s+(\w+)\s*\)/i);
      if (colMatch) {
        const col = colMatch[1];
        const distinct = new Set(rows.map(r => r[col]));
        return [[distinct.size]];
      }
    }

    // Handle SUM
    if (/^(?:COALESCE\s*\(\s*)?SUM\s*\(\s*(\w+)\s*\)/i.test(selectPart)) {
      const colMatch = selectPart.match(/SUM\s*\(\s*(\w+)\s*\)/i);
      if (colMatch) {
        const col = colMatch[1];
        const sum = rows.reduce((acc, r) => acc + (Number(r[col]) || 0), 0);
        return [[sum]];
      }
    }

    // Named columns
    const cols = selectPart.split(',').map(c => {
      const aliasMatch = c.trim().match(/^(.+?)\s+AS\s+(\w+)$/i);
      if (aliasMatch) return aliasMatch[1].trim();
      return c.trim();
    });
    return rows.map(r => cols.map(c => r[c] ?? null));
  }

  private applyWhere(rows: Row[], rest: string): Row[] {
    const whereMatch = rest.match(/WHERE\s+([\s\S]+?)(?:ORDER|LIMIT|GROUP|$)/i);
    if (!whereMatch) return [...rows];
    const conditions = whereMatch[1].trim();
    return rows.filter(r => this.evaluateWhere(r, conditions));
  }

  private evaluateWhere(row: Row, conditions: string): boolean {
    // Split by AND (simplified — does not handle OR or nested parens)
    const parts = conditions.split(/\s+AND\s+/i);
    return parts.every(cond => {
      const trimmed = cond.trim();

      // IS NULL
      const isNullMatch = trimmed.match(/^(\w+)\s+IS\s+NULL$/i);
      if (isNullMatch) return row[isNullMatch[1]] === null || row[isNullMatch[1]] === undefined;

      // IS NOT NULL
      const isNotNullMatch = trimmed.match(/^(\w+)\s+IS\s+NOT\s+NULL$/i);
      if (isNotNullMatch) return row[isNotNullMatch[1]] !== null && row[isNotNullMatch[1]] !== undefined;

      // LIKE
      const likeMatch = trimmed.match(/^(\w+)\s+LIKE\s+'(.+)'$/i);
      if (likeMatch) {
        const val = String(row[likeMatch[1]] ?? '').toLowerCase();
        const pattern = likeMatch[2].replace(/%/g, '.*').toLowerCase();
        return new RegExp(`^${pattern}$`).test(val);
      }

      // = comparison
      const eqMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (eqMatch) {
        const col = eqMatch[1];
        let expected: unknown = eqMatch[2].trim();
        // Remove quotes
        if (typeof expected === 'string' && expected.startsWith("'") && expected.endsWith("'")) {
          expected = expected.slice(1, -1);
        } else if (expected === 'NULL') {
          expected = null;
        } else if (!isNaN(Number(expected))) {
          expected = Number(expected);
        }
        const actual = row[col];
        // Loose comparison for number/string
        return String(actual) === String(expected);
      }

      // != / <> comparison
      const neqMatch = trimmed.match(/^(\w+)\s*(?:!=|<>)\s*(.+)$/);
      if (neqMatch) {
        const col = neqMatch[1];
        let expected: unknown = neqMatch[2].trim();
        if (typeof expected === 'string' && expected.startsWith("'") && expected.endsWith("'")) {
          expected = expected.slice(1, -1);
        }
        return String(row[col]) !== String(expected);
      }

      return true;
    });
  }

  private applyOrderBy(rows: Row[], rest: string): Row[] {
    const orderMatch = rest.match(/ORDER\s+BY\s+(\w+)\s*(ASC|DESC)?/i);
    if (!orderMatch) return rows;
    const col = orderMatch[1];
    const desc = orderMatch[2]?.toUpperCase() === 'DESC';
    return [...rows].sort((a, b) => {
      const va = a[col];
      const vb = b[col];
      if (va == null && vb == null) return 0;
      if (va == null) return desc ? 1 : -1;
      if (vb == null) return desc ? -1 : 1;
      const cmp = String(va).localeCompare(String(vb), undefined, { numeric: true });
      return desc ? -cmp : cmp;
    });
  }

  private applyLimit(rows: Row[], rest: string): Row[] {
    const limitMatch = rest.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      return rows.slice(0, parseInt(limitMatch[1]));
    }
    return rows;
  }

  private executeDML(sql: string): number {
    const upper = sql.toUpperCase().trim();

    if (upper.startsWith('INSERT') || upper.startsWith('REPLACE')) {
      return this.executeInsert(sql);
    } else if (upper.startsWith('UPDATE')) {
      return this.executeUpdate(sql);
    } else if (upper.startsWith('DELETE')) {
      return this.executeDelete(sql);
    }
    return 0;
  }

  private executeInsert(sql: string): number {
    // INSERT OR REPLACE / INSERT OR IGNORE / INSERT INTO
    const match = sql.match(/(?:INSERT|REPLACE)\s+(?:OR\s+\w+\s+)?INTO\s+(\w+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i);
    if (!match) return 0;

    const tableName = match[1];
    const columns = match[2].split(',').map(c => c.trim());
    const values = this.parseValues(match[3]);

    if (!this.state.tables[tableName]) {
      this.state.tables[tableName] = [];
      this.state.schemas[tableName] = columns;
    }

    const row: Row = {};
    columns.forEach((col, i) => {
      row[col] = values[i] ?? null;
    });

    const isReplace = /REPLACE|OR\s+REPLACE/i.test(sql);
    const isIgnore = /OR\s+IGNORE/i.test(sql);

    if (isReplace || isIgnore) {
      // Check for existing row by primary key (first column convention)
      const pk = columns[0];
      const existing = this.state.tables[tableName].findIndex(r => String(r[pk]) === String(row[pk]));
      if (existing >= 0) {
        if (isReplace) {
          this.state.tables[tableName][existing] = row;
        }
        // If IGNORE, do nothing
        return isReplace ? 1 : 0;
      }
    }

    this.state.tables[tableName].push(row);
    return 1;
  }

  private executeUpdate(sql: string): number {
    const match = sql.match(/UPDATE\s+(\w+)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i);
    if (!match) return 0;

    const tableName = match[1];
    const setPart = match[2];
    const wherePart = match[3];

    const table = this.state.tables[tableName];
    if (!table) return 0;

    const sets = this.parseSets(setPart);
    let count = 0;

    for (const row of table) {
      if (!wherePart || this.evaluateWhere(row, wherePart)) {
        for (const [col, val] of sets) {
          row[col] = val;
        }
        count++;
      }
    }

    return count;
  }

  private executeDelete(sql: string): number {
    const match = sql.match(/DELETE\s+FROM\s+(\w+)(?:\s+WHERE\s+([\s\S]+))?$/i);
    if (!match) return 0;

    const tableName = match[1];
    const wherePart = match[2];
    const table = this.state.tables[tableName];
    if (!table) return 0;

    const before = table.length;
    if (!wherePart) {
      this.state.tables[tableName] = [];
      return before;
    }

    this.state.tables[tableName] = table.filter(r => !this.evaluateWhere(r, wherePart));
    return before - this.state.tables[tableName].length;
  }

  private parseValues(valStr: string): unknown[] {
    return valStr.split(',').map(v => {
      const trimmed = v.trim();
      if (trimmed === 'NULL' || trimmed === 'null') return null;
      if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
        return trimmed.slice(1, -1).replace(/''/g, "'");
      }
      const num = Number(trimmed);
      if (!isNaN(num)) return num;
      return trimmed;
    });
  }

  private parseSets(setPart: string): [string, unknown][] {
    const pairs: [string, unknown][] = [];
    // Split on commas not inside quotes
    const parts = setPart.split(/,(?=(?:[^']*'[^']*')*[^']*$)/);
    for (const part of parts) {
      const match = part.trim().match(/^(\w+)\s*=\s*([\s\S]+)$/);
      if (!match) continue;
      const col = match[1];
      let val: unknown = match[2].trim();
      if (val === 'NULL' || val === 'null') val = null;
      else if (typeof val === 'string' && val.startsWith("'") && val.endsWith("'")) {
        val = val.slice(1, -1).replace(/''/g, "'");
      } else if (!isNaN(Number(val))) {
        val = Number(val);
      }
      pairs.push([col, val]);
    }
    return pairs;
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      console.warn('[BrowserDevelopmentAdapter] Failed to persist to localStorage');
    }
  }
}
