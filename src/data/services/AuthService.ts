// ============================================================================
// AuthService — High level authentication and signup orchestration
// ============================================================================

import type { DatabaseManager } from '../database/DatabaseManager';
import type { AccountRepository, LocalAccount } from '../repositories/AccountRepository';
import type { TesterRepository } from '../repositories/TesterRepository';
import { PasswordHasher } from './PasswordHasher';
import type { TesterProfile } from '../models';

export class AuthService {
  constructor(
    private db: DatabaseManager,
    private accountRepo: AccountRepository,
    private testerRepo: TesterRepository
  ) {}

  /**
   * Returns the currently active tester based on the 'active_tester_id' preference.
   */
  async getActiveTester(): Promise<TesterProfile | null> {
    const testerId = await this.accountRepo.getPreference('active_tester_id');
    if (!testerId) return null;
    return this.testerRepo.getById(testerId);
  }

  /**
   * Logs out the current user by clearing preferences.
   */
  async logout(): Promise<void> {
    await this.accountRepo.setPreference('active_account_id', '');
    await this.accountRepo.setPreference('active_tester_id', '');
  }

  /**
   * Logs in a user given an email and password.
   * Throws an error on failure (incorrect credentials).
   */
  async login(email: string, password: string): Promise<{ account: LocalAccount; tester: TesterProfile }> {
    const normalized = email.trim().toLowerCase();
    const account = await this.accountRepo.getByEmail(normalized);
    if (!account || account.disabled) {
      throw new Error('Incorrect email or password');
    }

    const isValid = await PasswordHasher.verify(password, account.passwordHash, account.passwordSalt);
    if (!isValid) {
      throw new Error('Incorrect email or password');
    }

    // Success! Update last login and set active user
    await this.accountRepo.updateLastLogin(account.localId);
    await this.accountRepo.setPreference('active_account_id', account.localId);
    await this.accountRepo.setPreference('active_tester_id', account.testerId);

    const tester = await this.testerRepo.getById(account.testerId);
    if (!tester) throw new Error('Tester profile missing for account');
    return { account, tester };
  }

  /**
   * Creates a new tester profile and an associated account atomically.
   */
  async signup(email: string, password: string, testerData: Omit<TesterProfile, 'localId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'recordVersion' | 'syncState'>): Promise<{ account: LocalAccount; tester: TesterProfile }> {
    const normalized = email.trim().toLowerCase();
    
    // Check if email already exists
    const existing = await this.accountRepo.getByEmail(normalized);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const hashResult = await PasswordHasher.hash(password);

    // Run atomically
    return this.db.transaction(async () => {
      const tester = await this.testerRepo.createTester(testerData);
      const account = await this.accountRepo.createAccount({
        testerId: tester.localId,
        emailNormalized: normalized,
        passwordHash: hashResult.hashHex,
        passwordSalt: hashResult.saltHex,
        passwordAlgorithm: hashResult.algorithm,
        passwordIterations: hashResult.iterations,
      });

      await this.accountRepo.setPreference('active_account_id', account.localId);
      await this.accountRepo.setPreference('active_tester_id', tester.localId);
      return { account, tester };
    });
  }

  /**
   * For existing testers who don't have an account yet.
   */
  async linkAccountToExistingTester(testerId: string, email: string, password: string): Promise<{ account: LocalAccount; tester: TesterProfile }> {
    const normalized = email.trim().toLowerCase();
    
    const existing = await this.accountRepo.getByEmail(normalized);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const hashResult = await PasswordHasher.hash(password);

    return this.db.transaction(async () => {
      const account = await this.accountRepo.createAccount({
        testerId,
        emailNormalized: normalized,
        passwordHash: hashResult.hashHex,
        passwordSalt: hashResult.saltHex,
        passwordAlgorithm: hashResult.algorithm,
        passwordIterations: hashResult.iterations,
      });
      await this.accountRepo.setPreference('active_account_id', account.localId);
      await this.accountRepo.setPreference('active_tester_id', testerId);
      const tester = await this.testerRepo.getById(testerId);
      if (!tester) throw new Error('Tester profile missing');
      return { account, tester };
    });
  }
}
