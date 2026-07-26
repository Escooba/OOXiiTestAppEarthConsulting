// ============================================================================
// DataProvider — React Context for the SQLite Database Layer
// ============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DatabaseManager } from './database/DatabaseManager';
import { NativeSQLiteAdapter } from './database/NativeSQLiteAdapter';
import { WebSqliteAdapter } from './database/WebSqliteAdapter';
import { TesterRepository } from './repositories/TesterRepository';
import { ClientRepository } from './repositories/ClientRepository';
import { TestSessionRepository } from './repositories/TestSessionRepository';
import { ProgressRepository } from './repositories/ProgressRepository';
import { GardenRepository } from './repositories/GardenRepository';
import { BadgeRepository } from './repositories/BadgeRepository';
import { SyncRepository } from './repositories/SyncRepository';
import { AccountRepository } from './repositories/AccountRepository';
import { TestWorkflowService } from './services/TestWorkflowService';
import { GamificationService } from './services/GamificationService';
import { TestCompletionService } from './services/TestCompletionService';
import { SyncCoordinator } from './services/SyncCoordinator';
import { DisabledSyncTransport } from './services/SyncTransport';
import { AuthService } from './services/AuthService';
import { CsvImporter } from './services/CsvImporter';
import { generateLocalId } from './models';

interface DataContextState {
  db: DatabaseManager | null;
  testerRepo: TesterRepository | null;
  clientRepo: ClientRepository | null;
  sessionRepo: TestSessionRepository | null;
  progressRepo: ProgressRepository | null;
  gardenRepo: GardenRepository | null;
  badgeRepo: BadgeRepository | null;
  accountRepo: AccountRepository | null;
  workflowService: TestWorkflowService | null;
  completionService: TestCompletionService | null;
  authService: AuthService | null;
  syncCoordinator: SyncCoordinator | null;
  csvImporter: CsvImporter | null;
  loading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextState>({
  db: null, testerRepo: null, clientRepo: null, sessionRepo: null,
  progressRepo: null, gardenRepo: null, badgeRepo: null, accountRepo: null,
  workflowService: null, completionService: null, authService: null, syncCoordinator: null,
  csvImporter: null,
  loading: true, error: null,
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DataContextState>({
    db: null, testerRepo: null, clientRepo: null, sessionRepo: null,
    progressRepo: null, gardenRepo: null, badgeRepo: null, accountRepo: null,
    workflowService: null, completionService: null, authService: null, syncCoordinator: null,
    csvImporter: null,
    loading: true, error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function initDB() {
      try {
        // Decide adapter based on environment
        // In a real app we'd use Capacitor.isNativePlatform(), for Vite we use a simple check
        const isCapacitor = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.();
        const adapter = isCapacitor ? new NativeSQLiteAdapter() : new WebSqliteAdapter();
        
        const db = new DatabaseManager(adapter);
        await db.initialise();

        const testerRepo = new TesterRepository(db);
        const clientRepo = new ClientRepository(db);
        const sessionRepo = new TestSessionRepository(db);
        const progressRepo = new ProgressRepository(db);
        const gardenRepo = new GardenRepository(db);
        const badgeRepo = new BadgeRepository(db);
        const syncRepo = new SyncRepository(db);
        const accountRepo = new AccountRepository(db);

        const gamification = new GamificationService(db, badgeRepo, sessionRepo);
        const workflowService = new TestWorkflowService(sessionRepo, clientRepo, testerRepo);
        const completionService = new TestCompletionService(db, sessionRepo, syncRepo, gamification);
        const authService = new AuthService(db, accountRepo, testerRepo);
        
        const transport = new DisabledSyncTransport();
        const syncCoordinator = new SyncCoordinator(syncRepo, transport);
        
        const csvImporter = new CsvImporter(db, testerRepo, clientRepo, sessionRepo);



        if (mounted) {
          setState({
            db, testerRepo, clientRepo, sessionRepo, progressRepo, gardenRepo, badgeRepo, accountRepo,
            workflowService, completionService, authService, syncCoordinator, csvImporter,
            loading: false, error: null,
          });
        }
      } catch (err) {
        console.error('[DataProvider] Failed to initialise SQLite:', err);
        if (mounted) {
          setState(s => ({ ...s, loading: false, error: err instanceof Error ? err : new Error(String(err)) }));
        }
      }
    }

    initDB();

    return () => { mounted = false; };
  }, []);

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#2A0730] text-white p-5">
        <h2 className="text-[#FF5C5C] text-xl font-bold mb-4">Database Error</h2>
        <p className="text-sm bg-black/30 p-4 rounded-lg font-mono text-red-200">{state.error.message}</p>
      </div>
    );
  }

  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#2A0730] text-white">
        <div className="w-12 h-12 border-4 border-[#A984FF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#9B93BA]">Loading local database...</p>
      </div>
    );
  }

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context.db) throw new Error('useData must be used within a DataProvider');
  return context as {
    [K in keyof Omit<DataContextState, 'loading' | 'error'>]: NonNullable<DataContextState[K]>;
  };
}
