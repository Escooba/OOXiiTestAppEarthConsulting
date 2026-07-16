// ============================================================================
// ClientRepository — CRUD and search for clients
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { Client, SyncState } from '../models';
import { generateLocalId, nowUtcMs } from '../models';

interface ClientRow {
  local_id: string; remote_id: string | null; ooxii_client_id: string;
  year_of_birth: number; gender: string; cataract_surgery: string;
  country: string; state_province: string; city: string;
  created_by_tester_id: string; created_at: number; updated_at: number;
  deleted_at: number | null; record_version: number; sync_state: string;
}

function rowToClient(r: ClientRow): Client {
  return {
    localId: r.local_id, remoteId: r.remote_id, ooxiiClientId: r.ooxii_client_id,
    yearOfBirth: r.year_of_birth, gender: r.gender, cataractSurgery: r.cataract_surgery,
    country: r.country, stateProvince: r.state_province, city: r.city,
    createdByTesterId: r.created_by_tester_id, createdAt: r.created_at,
    updatedAt: r.updated_at, deletedAt: r.deleted_at,
    recordVersion: r.record_version, syncState: r.sync_state as SyncState,
  };
}

const SELECT_COLS = 'local_id, remote_id, ooxii_client_id, year_of_birth, gender, cataract_surgery, country, state_province, city, created_by_tester_id, created_at, updated_at, deleted_at, record_version, sync_state';

export class ClientRepository {
  constructor(private db: DatabaseManager) {}

  async create(data: { ooxiiClientId: string; yearOfBirth: number; gender: string; cataractSurgery: string; country: string; stateProvince: string; city: string; createdByTesterId: string; remoteId?: string | null }): Promise<Client> {
    const now = nowUtcMs();
    const localId = generateLocalId();
    await this.db.run(
      `INSERT INTO clients (local_id, remote_id, ooxii_client_id, year_of_birth, gender, cataract_surgery, country, state_province, city, created_by_tester_id, created_at, updated_at, record_version, sync_state)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'local')`,
      [localId, data.remoteId ?? null, data.ooxiiClientId, data.yearOfBirth, data.gender, data.cataractSurgery, data.country, data.stateProvince, data.city, data.createdByTesterId, now, now]
    );
    return (await this.findByLocalId(localId))!;
  }

  async findByLocalId(localId: string): Promise<Client | null> {
    const rows = await this.db.query<ClientRow>(`SELECT ${SELECT_COLS} FROM clients WHERE local_id = ?`, [localId]);
    return rows.length > 0 ? rowToClient(rows[0]) : null;
  }

  async findByOoxiiId(ooxiiClientId: string): Promise<Client | null> {
    const rows = await this.db.query<ClientRow>(`SELECT ${SELECT_COLS} FROM clients WHERE ooxii_client_id = ? AND deleted_at IS NULL`, [ooxiiClientId]);
    return rows.length > 0 ? rowToClient(rows[0]) : null;
  }

  async search(query: string): Promise<Client[]> {
    const q = `%${query}%`;
    const rows = await this.db.query<ClientRow>(
      `SELECT ${SELECT_COLS} FROM clients WHERE deleted_at IS NULL AND (ooxii_client_id LIKE ? OR gender LIKE ? OR city LIKE ? OR cataract_surgery LIKE ?) ORDER BY updated_at DESC LIMIT 50`,
      [q, q, q, q]
    );
    return rows.map(rowToClient);
  }

  async listRecent(limit = 20): Promise<Client[]> {
    const rows = await this.db.query<ClientRow>(
      `SELECT ${SELECT_COLS} FROM clients WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT ?`,
      [limit]
    );
    return rows.map(rowToClient);
  }

  async update(localId: string, data: Partial<Pick<Client, 'yearOfBirth' | 'gender' | 'cataractSurgery' | 'country' | 'stateProvince' | 'city'>>): Promise<void> {
    const sets: string[] = [];
    const params: unknown[] = [];
    if (data.yearOfBirth !== undefined) { sets.push('year_of_birth = ?'); params.push(data.yearOfBirth); }
    if (data.gender !== undefined) { sets.push('gender = ?'); params.push(data.gender); }
    if (data.cataractSurgery !== undefined) { sets.push('cataract_surgery = ?'); params.push(data.cataractSurgery); }
    if (data.country !== undefined) { sets.push('country = ?'); params.push(data.country); }
    if (data.stateProvince !== undefined) { sets.push('state_province = ?'); params.push(data.stateProvince); }
    if (data.city !== undefined) { sets.push('city = ?'); params.push(data.city); }
    if (sets.length === 0) return;
    sets.push('updated_at = ?'); params.push(nowUtcMs());
    sets.push('record_version = record_version + 1');
    params.push(localId);
    await this.db.run(`UPDATE clients SET ${sets.join(', ')} WHERE local_id = ?`, params);
  }

  async softDelete(localId: string): Promise<void> {
    await this.db.run('UPDATE clients SET deleted_at = ?, updated_at = ? WHERE local_id = ?', [nowUtcMs(), nowUtcMs(), localId]);
  }
}
