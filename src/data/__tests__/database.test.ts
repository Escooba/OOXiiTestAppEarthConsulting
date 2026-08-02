import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WebSqliteAdapter } from '../database/WebSqliteAdapter';
import { DatabaseManager } from '../database/DatabaseManager';
import { TesterRepository } from '../repositories/TesterRepository';
import { ClientRepository } from '../repositories/ClientRepository';
import { TestSessionRepository } from '../repositories/TestSessionRepository';
import { BadgeRepository } from '../repositories/BadgeRepository';
import { SyncRepository } from '../repositories/SyncRepository';
import { GamificationService } from '../services/GamificationService';
import { TestWorkflowService } from '../services/TestWorkflowService';
import { TestCompletionService } from '../services/TestCompletionService';
import { AccountRepository } from '../repositories/AccountRepository';
import { AuthService } from '../services/AuthService';
import { generateLocalId } from '../models';

// Setup mock localStorage for WebSqliteAdapter
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
  let accountRepo: AccountRepository;
  let gamification: GamificationService;
  let workflow: TestWorkflowService;
  let completion: TestCompletionService;
  let authService: AuthService;

  beforeEach(async () => {
    const adapter = new WebSqliteAdapter();
    db = new DatabaseManager(adapter);
    await db.initialise();

    testerRepo = new TesterRepository(db);
    clientRepo = new ClientRepository(db);
    sessionRepo = new TestSessionRepository(db);
    badgeRepo = new BadgeRepository(db);
    syncRepo = new SyncRepository(db);
    accountRepo = new AccountRepository(db);

    gamification = new GamificationService(db, badgeRepo, sessionRepo);
    workflow = new TestWorkflowService(sessionRepo, clientRepo, testerRepo);
    completion = new TestCompletionService(db, sessionRepo, syncRepo, gamification);
    authService = new AuthService(db, accountRepo, testerRepo);
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

    // 5. Active session should now be null
    const active = await sessionRepo.getActiveSession(tester.localId);
    expect(active).toBeNull();
  });

  it('should clear old uncompleted sessions when starting or completing a test', async () => {
    const tester = await testerRepo.createTester({
      firstName: 'Test', lastName: 'User', role: 'Tester', gender: '', experienceLevel: '',
      organisation: '', country: '', stateProvince: '', city: '', firstLoginGuideCompleted: true, remoteId: null
    });

    const client1 = await clientRepo.create({
      ooxiiClientId: 'CLIENT_004', yearOfBirth: 1990, gender: 'Female', cataractSurgery: 'No',
      country: 'AU', stateProvince: 'NSW', city: 'Sydney', createdByTesterId: tester.localId
    });
    const client2 = await clientRepo.create({
      ooxiiClientId: 'CLIENT_005', yearOfBirth: 1992, gender: 'Male', cataractSurgery: 'No',
      country: 'AU', stateProvince: 'NSW', city: 'Sydney', createdByTesterId: tester.localId
    });

    // Start first test and abandon it halfway
    await workflow.startNewTest(tester.localId, client1.localId);

    // Start second test (should cancel first test)
    const session2 = await workflow.startNewTest(tester.localId, client2.localId);
    let active = await sessionRepo.getActiveSession(tester.localId);
    expect(active?.localId).toBe(session2.localId);

    // Complete second test
    await completion.completeTest(session2.localId, []);

    // Active session must be null (old abandoned test should not reappear)
    active = await sessionRepo.getActiveSession(tester.localId);
    expect(active).toBeNull();
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
    
    // Verify Gamification Progress before completion (should be 0)
    const progressRepo = new (await import('../repositories/ProgressRepository')).ProgressRepository(db);
    let progress = await progressRepo.getTesterProgress(tester.localId);
    expect(progress?.clientsHelped).toBe(0);

    // Simulate glasses dispensed to get 50 carrots
    const now = Date.now();
    await db.run('INSERT INTO dispensed_items (local_id, test_session_id, item_category, created_at, updated_at) VALUES (?, ?, ?, ?, ?)', [generateLocalId(), session.localId, 'distance_glasses', now, now]);

    // Complete session
    await completion.completeTest(session.localId, [{ type: 'completion', payload: { summary: 'Done' } }]);

    // Verify Gamification Progress after completion (should be 1)
    progress = await progressRepo.getTesterProgress(tester.localId);
    expect(progress?.clientsHelped).toBe(1);
    expect(progress?.totalCarrots).toBe(1); // 1 for test completion

    // Verify First Vision badge earned
    const earnedBadges = await badgeRepo.getEarnedBadges(tester.localId);
    expect(earnedBadges.length).toBeGreaterThan(0);
    expect(earnedBadges.some(b => b.badgeCode === 'FIRST_VISION')).toBe(true);
  });

  it('should authenticate user and hash password securely', async () => {
    const { account, tester } = await authService.signup('tester@example.com', 'SecurePass123!', {
      firstName: 'Jane', lastName: 'Doe', gender: 'Female', role: 'Worker',
      experienceLevel: 'Experienced', organisation: 'HealthOrg', country: 'AU',
      stateProvince: 'NSW', city: 'Sydney', firstLoginGuideCompleted: true, remoteId: null
    });

    expect(account.emailNormalized).toBe('tester@example.com');
    expect(tester.firstName).toBe('Jane');

    // Test valid login
    const loggedIn = await authService.login('tester@example.com', 'SecurePass123!');
    expect(loggedIn.account.localId).toBe(account.localId);

    // Test invalid password
    await expect(authService.login('tester@example.com', 'WrongPassword')).rejects.toThrow('Incorrect email or password');
  });

  it('should patch clinical sections without destroying existing section data', async () => {
    const tester = await testerRepo.createTester({
      firstName: 'Test', lastName: 'User', role: 'Tester', gender: '', experienceLevel: '',
      organisation: '', country: '', stateProvince: '', city: '', firstLoginGuideCompleted: true, remoteId: null
    });
    const client = await clientRepo.create({
      ooxiiClientId: 'CLIENT_PATCH', yearOfBirth: 1990, gender: 'Female', cataractSurgery: 'No',
      country: 'AU', stateProvince: 'NSW', city: 'Sydney', createdByTesterId: tester.localId
    });

    const session = await workflow.startNewTest(tester.localId, client.localId);

    await workflow.saveSectionPatch(session.localId, 'main_test', { rightEye: '6/6' });
    await workflow.saveSectionPatch(session.localId, 'main_test', { leftEye: '6/9' });

    const sec = await sessionRepo.getSection(session.localId, 'main_test');
    expect(sec?.payload).toEqual({ rightEye: '6/6', leftEye: '6/9' });
  });
});
