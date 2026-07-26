// ============================================================================
// AccountRepository — Manages local_accounts and app_preferences tables
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import { generateLocalId, nowUtcMs } from '../models';

export interface LocalAccount {
  localId: string;
  testerId: string;
  emailNormalized: string;
  passwordHash: string;
  passwordSalt: string;
  passwordAlgorithm: string;
  passwordIterations: number;
  createdAt: number;
  updatedAt: number;
  lastLoginAt: number | null;
  disabled: boolean;
}

export class AccountRepository {
  constructor(private db: DatabaseManager) {}

  async createAccount(account: Omit<LocalAccount, 'localId' | 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'disabled'>): Promise<LocalAccount> {
    const now = nowUtcMs();
    const localId = generateLocalId();
    await this.db.run(
      `INSERT INTO local_accounts (
        local_id, tester_id, email_normalized, password_hash, password_salt, 
        password_algorithm, password_iterations, created_at, updated_at, disabled
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        localId, account.testerId, account.emailNormalized, account.passwordHash,
        account.passwordSalt, account.passwordAlgorithm, account.passwordIterations,
        now, now
      ]
    );
    return (await this.getByEmail(account.emailNormalized))!;
  }

  async getByEmail(emailNormalized: string): Promise<LocalAccount | null> {
    const rows = await this.db.query<any>('SELECT * FROM local_accounts WHERE email_normalized = ?', [emailNormalized]);
    if (rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async updateLastLogin(localId: string): Promise<void> {
    await this.db.run('UPDATE local_accounts SET last_login_at = ?, updated_at = ? WHERE local_id = ?', [nowUtcMs(), nowUtcMs(), localId]);
  }

  async getPreference(key: string): Promise<string | null> {
    const rows = await this.db.query<{ pref_value: string }>('SELECT pref_value FROM app_preferences WHERE pref_key = ?', [key]);
    return rows.length > 0 ? rows[0].pref_value : null;
  }

  async setPreference(key: string, value: string): Promise<void> {
    const now = nowUtcMs();
    await this.db.run(
      'INSERT INTO app_preferences (pref_key, pref_value, updated_at) VALUES (?, ?, ?) ON CONFLICT(pref_key) DO UPDATE SET pref_value = excluded.pref_value, updated_at = excluded.updated_at',
      [key, value, now]
    );
  }

  private mapRow(row: any): LocalAccount {
    return {
      localId: row.local_id,
      testerId: row.tester_id,
      emailNormalized: row.email_normalized,
      passwordHash: row.password_hash,
      passwordSalt: row.password_salt,
      passwordAlgorithm: row.password_algorithm,
      passwordIterations: row.password_iterations,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at,
      disabled: row.disabled === 1,
    };
  }
}
