// ============================================================================
// CsvImporter — Imports the Sample Data OOXii.csv into SQLite idempotently
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { ClientRepository } from '../repositories/ClientRepository';
import type { TestSessionRepository } from '../repositories/TestSessionRepository';
import type { TesterRepository } from '../repositories/TesterRepository';
import { generateLocalId, nowUtcMs } from '../models';

export class CsvImporter {
  constructor(
    private db: DatabaseManager,
    private testerRepo: TesterRepository,
    private clientRepo: ClientRepository,
    private sessionRepo: TestSessionRepository
  ) {}

  /** 
   * Parses the raw CSV string and idempotently imports clients, sessions, and metrics.
   * Returns the number of new records imported.
   */
  async importCsv(csvContent: string): Promise<{ newClients: number; newSessions: number }> {
    let newClients = 0;
    let newSessions = 0;

    const lines = csvContent.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) return { newClients, newSessions };

    const headers = lines[0].split(',').map(h => h.trim());
    
    // Ensure we have a default tester for these imported records
    let defaultTester = await this.testerRepo.getCurrentTester();
    if (!defaultTester) {
      defaultTester = await this.testerRepo.createTester({
        firstName: 'System', lastName: 'Import', gender: '',
        role: 'Importer', experienceLevel: '', organisation: '',
        country: 'AU', stateProvince: 'NSW', city: 'Sydney',
        firstLoginGuideCompleted: true, remoteId: null,
      });
    }

    for (let i = 1; i < lines.length; i++) {
      const parts = this.parseCsvLine(lines[i]);
      if (parts.length < headers.length) continue;

      const record: Record<string, string> = {};
      headers.forEach((h, idx) => { record[h] = parts[idx]; });

      const ooxiiId = record['clientId'];
      if (!ooxiiId) continue;

      await this.db.transaction(async () => {
        // 1. Client
        let client = await this.clientRepo.findByOoxiiId(ooxiiId);
        if (!client) {
          const yobRaw = record['regionSelection.yearOfBirth'] || '1970'; // fallback
          client = await this.clientRepo.create({
            ooxiiClientId: ooxiiId,
            yearOfBirth: parseInt(yobRaw, 10) || 1970,
            gender: 'Unknown',
            cataractSurgery: 'Unknown',
            country: record['regionSelection.selectedRegion.country'] || 'AU',
            stateProvince: record['regionSelection.selectedRegion.state'] || 'NSW',
            city: record['regionSelection.selectedRegion.city'] || 'Sydney',
            createdByTesterId: defaultTester!.localId,
          });
          newClients++;
        }

        // 2. Test Session
        const startedAtRaw = record['startedAt'];
        if (!startedAtRaw) return; // skip if no session data

        // Use _id as idempotency key or remote ID
        const remoteId = record['_id'];
        
        // Check if session exists (by remote ID)
        const existingSession = await this.db.query<{ local_id: string }>(
          'SELECT local_id FROM test_sessions WHERE remote_id = ?',
          [remoteId]
        );

        if (existingSession.length === 0) {
          const startedAt = new Date(startedAtRaw).getTime() || nowUtcMs();
          const completedAtRaw = record['completedAt'];
          const completedAt = completedAtRaw ? new Date(completedAtRaw).getTime() : null;

          const localSessionId = generateLocalId();
          
          await this.db.run(
            `INSERT INTO test_sessions (local_id, remote_id, client_id, tester_id, display_test_number, status, started_at, completed_at, created_at, updated_at, record_version, sync_state)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'local')`,
            [
              localSessionId, remoteId, client!.localId, defaultTester!.localId,
              record['number'] || '00',
              record['status'] === 'completed' ? 'completed' : 'in_progress',
              startedAt, completedAt, startedAt, completedAt || startedAt
            ]
          );

          // Insert raw payload as a completion section for the prototype
          await this.sessionRepo.saveSection(localSessionId, 'completion', record);
          
          newSessions++;
        }
      });
    }

    return { newClients, newSessions };
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map(s => s.replace(/^"|"$/g, ''));
  }
}
