import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserDevelopmentAdapter } from '../database/BrowserDevelopmentAdapter';
import { DatabaseManager } from '../database/DatabaseManager';
import { TesterRepository } from '../repositories/TesterRepository';
import { ClientRepository } from '../repositories/ClientRepository';
import { TestSessionRepository } from '../repositories/TestSessionRepository';
import { BadgeRepository } from '../repositories/BadgeRepository';
import { SyncRepository } from '../repositories/SyncRepository';
import { GamificationService } from '../services/GamificationService';
import { TestWorkflowService } from '../services/TestWorkflowService';
import { TestCompletionService } from '../services/TestCompletionService';
import { generateLocalId } from '../models';

// Setup mock localStorage for BrowserDevelopmentAdapter
const mockLocalStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
global.localStorage = mockLocalStorage as any;

describe('Database System Tests', () => {
  let db: DatabaseManager;
  let testerRepo: TesterRepository;
  let clientRepo: ClientRepository;
  let sessionRepo: TestSessionRepository;
  let badgeRepo: BadgeRepository;
  let syncRepo: SyncRepository;
  let gamification: GamificationService;
  let workflow: TestWorkflowService;
  let completion: TestCompletionService;

  beforeEach(async () => {
    // Clear storage key concept if we had real localStorage, but we mock it.
    // The adapter creates an in-memory state each time open() is called without localStorage data.
    const adapter = new BrowserDevelopmentAdapter();
    db = new DatabaseManager(adapter);
    await db.initialise();

    testerRepo = new TesterRepository(db);
    clientRepo = new ClientRepository(db);
    sessionRepo = new TestSessionRepository(db);
    badgeRepo = new BadgeRepository(db);
    syncRepo = new SyncRepository(db);

    gamification = new GamificationService(db, badgeRepo, sessionRepo);
    workflow = new TestWorkflowService(sessionRepo, clientRepo, testerRepo);
    completion = new TestCompletionService(db, sessionRepo, syncRepo, gamification);
  });

  afterEach(async () => {
    // Wait for the adapter to persist if needed
    // no-op
  });

  it('should initialize schema properly', async () => {
    // Verify the tables exist by doing a basic query
    // Let's just use the repo to test table existence.
    const tester = await testerRepo.createTester({
      firstName: 'Test',
      lastName: 'User',
      role: 'Tester',
      gender: 'Unknown',
      experienceLevel: 'None',
      organisation: 'Org',
      country: 'AU',
      stateProvince: 'NSW',
      city: 'Sydney',
      firstLoginGuideCompleted: true,
      remoteId: null
    });

    expect(tester).toBeDefined();
    expect(tester.firstName).toBe('Test');
    
    const retrieved = await testerRepo.getCurrentTester();
    expect(retrieved).not.toBeNull();
    expect(retrieved?.localId).toBe(tester.localId);
  });

  it('should create and retrieve a client', async () => {
    const tester = await testerRepo.createTester({
      firstName: 'Test', lastName: 'User', role: 'Tester', gender: '', experienceLevel: '',
      organisation: '', country: '', stateProvince: '', city: '', firstLoginGuideCompleted: true, remoteId: null
    });

    const client = await clientRepo.create({
      ooxiiClientId: 'CLIENT_001',
      yearOfBirth: 1990,
      gender: 'Female',
      cataractSurgery: 'No',
      country: 'AU',
      stateProvince: 'NSW',
      city: 'Sydney',
      createdByTesterId: tester.localId
    });

    expect(client.localId).toBeDefined();
    expect(client.ooxiiClientId).toBe('CLIENT_001');

    const byId = await clientRepo.findByLocalId(client.localId);
    expect(byId?.localId).toBe(client.localId);
  });

  it('should run a test session workflow', async () => {
    const tester = await testerRepo.createTester({
      firstName: 'Test', lastName: 'User', role: 'Tester', gender: '', experienceLevel: '',
      organisation: '', country: '', stateProvince: '', city: '', firstLoginGuideCompleted: true, remoteId: null
    });

    const client = await clientRepo.create({
      ooxiiClientId: 'CLIENT_002',
      yearOfBirth: 1980,
      gender: 'Male',
      cataractSurgery: 'Yes',
      country: 'AU',
      stateProvince: 'NSW',
      city: 'Sydney',
      createdByTesterId: tester.localId
    });

    // 1. Start Test
    const session = await workflow.startNewTest(tester.localId, client.localId);
    expect(session.status).toBe('in_progress');
    expect(session.currentRoute).toBeNull();

    // 2. Save Progress
    await workflow.saveProgress(session.localId, 'distance-right-eye');
    const updated = await sessionRepo.getById(session.localId);
    expect(updated?.currentRoute).toBe('distance-right-eye');

    // 3. Save Section Data
    await sessionRepo.saveSection(session.localId, 'main_test', { va: '6/12' });
    const sectionData = await sessionRepo.getSection(session.localId, 'main_test');
    expect(sectionData?.payload).toEqual({ va: '6/12' });

    // 4. Complete Test
    await completion.completeTest(session.localId, [{ type: 'completion', payload: { additionalNotes: 'Test completed' } }]);
    const completed = await sessionRepo.getById(session.localId);
    expect(completed?.status).toBe('completed');
  });

  it('should earn badges after test completion', async () => {
    const tester = await testerRepo.createTester({
      firstName: 'Test', lastName: 'User', role: 'Tester', gender: '', experienceLevel: '',
      organisation: '', country: '', stateProvince: '', city: '', firstLoginGuideCompleted: true, remoteId: null
    });

    const client = await clientRepo.create({
      ooxiiClientId: 'CLIENT_003',
      yearOfBirth: 1995,
      gender: 'Unknown',
      cataractSurgery: 'No',
      country: 'AU',
      stateProvince: 'NSW',
      city: 'Sydney',
      createdByTesterId: tester.localId
    });

    // First Session
    const session = await workflow.startNewTest(tester.localId, client.localId);
    
    // Simulate glasses dispensed to get 50 carrots
    await db.run('INSERT INTO dispensed_items (local_id, session_id, item_type) VALUES (?, ?, ?)', [generateLocalId(), session.localId, 'distance_glasses']);

    // Complete session
    await completion.completeTest(session.localId, [{ type: 'completion', payload: { summary: 'Done' } }]);

    // Verify Gamification Progress
    const progressRepo = new (await import('../repositories/ProgressRepository')).ProgressRepository(db);
    const progress = await progressRepo.getTesterProgress(tester.localId);
    expect(progress?.clientsHelped).toBe(1);
    expect(progress?.totalCarrots).toBe(1); // 1 for test completion

    // Verify First Vision badge earned
    const earnedBadges = await badgeRepo.getEarnedBadges(tester.localId);
    expect(earnedBadges.length).toBeGreaterThan(0);
    expect(earnedBadges.some(b => b.badgeCode === 'FIRST_VISION')).toBe(true);
  });
});
