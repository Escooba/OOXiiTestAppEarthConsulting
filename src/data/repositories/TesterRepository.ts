// ============================================================================
// TesterRepository — CRUD for tester profiles
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { TesterProfile, SyncState } from '../models';
import { generateLocalId, nowUtcMs } from '../models';

interface TesterRow {
  local_id: string;
  remote_id: string | null;
  first_name: string;
  last_name: string;
  gender: string;
  role: string;
  experience_level: string;
  organisation: string;
  country: string;
  state_province: string;
  city: string;
  first_login_guide_completed: number;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
  record_version: number;
  sync_state: string;
}

function rowToTester(row: TesterRow): TesterProfile {
  return {
    localId: row.local_id,
    remoteId: row.remote_id,
    firstName: row.first_name,
    lastName: row.last_name,
    gender: row.gender,
    role: row.role,
    experienceLevel: row.experience_level,
    organisation: row.organisation,
    country: row.country,
    stateProvince: row.state_province,
    city: row.city,
    firstLoginGuideCompleted: row.first_login_guide_completed === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
    recordVersion: row.record_version,
    syncState: row.sync_state as SyncState,
  };
}

export class TesterRepository {
  constructor(private db: DatabaseManager) {}

  async createTester(data: Omit<TesterProfile, 'localId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'recordVersion' | 'syncState'>): Promise<TesterProfile> {
    const now = nowUtcMs();
    const localId = generateLocalId();
    await this.db.run(
      `INSERT INTO tester_profiles (local_id, remote_id, first_name, last_name, gender, role, experience_level, organisation, country, state_province, city, first_login_guide_completed, created_at, updated_at, record_version, sync_state)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'local')`,
      [localId, data.remoteId, data.firstName, data.lastName, data.gender, data.role, data.experienceLevel, data.organisation, data.country, data.stateProvince, data.city, data.firstLoginGuideCompleted ? 1 : 0, now, now]
    );
    return this.getById(localId) as Promise<TesterProfile>;
  }

  async getById(localId: string): Promise<TesterProfile | null> {
    const rows = await this.db.query<TesterRow>(
      'SELECT local_id, remote_id, first_name, last_name, gender, role, experience_level, organisation, country, state_province, city, first_login_guide_completed, created_at, updated_at, deleted_at, record_version, sync_state FROM tester_profiles WHERE local_id = ?',
      [localId]
    );
    return rows.length > 0 ? rowToTester(rows[0]) : null;
  }

  async getCurrentTester(): Promise<TesterProfile | null> {
    const rows = await this.db.query<TesterRow>(
      'SELECT local_id, remote_id, first_name, last_name, gender, role, experience_level, organisation, country, state_province, city, first_login_guide_completed, created_at, updated_at, deleted_at, record_version, sync_state FROM tester_profiles WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 1'
    );
    return rows.length > 0 ? rowToTester(rows[0]) : null;
  }

  async listAll(): Promise<TesterProfile[]> {
    const rows = await this.db.query<TesterRow>(
      'SELECT local_id, remote_id, first_name, last_name, gender, role, experience_level, organisation, country, state_province, city, first_login_guide_completed, created_at, updated_at, deleted_at, record_version, sync_state FROM tester_profiles WHERE deleted_at IS NULL ORDER BY created_at DESC'
    );
    return rows.map(rowToTester);
  }

  async updateProfile(localId: string, data: Partial<Pick<TesterProfile, 'firstName' | 'lastName' | 'gender' | 'role' | 'experienceLevel' | 'organisation' | 'country' | 'stateProvince' | 'city'>>): Promise<void> {
    const sets: string[] = [];
    const params: unknown[] = [];
    const now = nowUtcMs();

    if (data.firstName !== undefined) { sets.push('first_name = ?'); params.push(data.firstName); }
    if (data.lastName !== undefined) { sets.push('last_name = ?'); params.push(data.lastName); }
    if (data.gender !== undefined) { sets.push('gender = ?'); params.push(data.gender); }
    if (data.role !== undefined) { sets.push('role = ?'); params.push(data.role); }
    if (data.experienceLevel !== undefined) { sets.push('experience_level = ?'); params.push(data.experienceLevel); }
    if (data.organisation !== undefined) { sets.push('organisation = ?'); params.push(data.organisation); }
    if (data.country !== undefined) { sets.push('country = ?'); params.push(data.country); }
    if (data.stateProvince !== undefined) { sets.push('state_province = ?'); params.push(data.stateProvince); }
    if (data.city !== undefined) { sets.push('city = ?'); params.push(data.city); }

    if (sets.length === 0) return;
    sets.push('updated_at = ?');
    params.push(now);
    sets.push('record_version = record_version + 1');
    params.push(localId);

    await this.db.run(`UPDATE tester_profiles SET ${sets.join(', ')} WHERE local_id = ?`, params);
  }

  async updateGuideCompleted(localId: string, completed: boolean): Promise<void> {
    await this.db.run(
      'UPDATE tester_profiles SET first_login_guide_completed = ?, updated_at = ? WHERE local_id = ?',
      [completed ? 1 : 0, nowUtcMs(), localId]
    );
  }
}
