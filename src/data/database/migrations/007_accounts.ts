import type { Migration } from './types';

export const migration007: Migration = {
  version: 7,
  name: 'accounts',
  up: `
CREATE TABLE IF NOT EXISTS local_accounts (
  local_id TEXT PRIMARY KEY,
  tester_id TEXT NOT NULL,
  email_normalized TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_algorithm TEXT NOT NULL,
  password_iterations INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_login_at INTEGER,
  disabled INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(tester_id) REFERENCES tester_profiles(local_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_local_accounts_email ON local_accounts(email_normalized);
CREATE INDEX IF NOT EXISTS idx_local_accounts_tester_id ON local_accounts(tester_id);

CREATE TABLE IF NOT EXISTS app_preferences (
  pref_key TEXT PRIMARY KEY,
  pref_value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
  `,
};
