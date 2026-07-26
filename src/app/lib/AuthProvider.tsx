import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useData } from '../../data/DataProvider';
import type { LocalAccount } from '../../data/repositories/AccountRepository';
import type { TesterProfile } from '../../data/models';

interface AuthContextType {
  account: LocalAccount | null;
  tester: TesterProfile | null;
  isLoading: boolean;
  error: string | null;
  legacyTesters: TesterProfile[];
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, testerData: Omit<TesterProfile, 'localId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'recordVersion' | 'syncState'>) => Promise<void>;
  linkAccount: (testerId: string, email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  account: null,
  tester: null,
  isLoading: true,
  error: null,
  legacyTesters: [],
  login: async () => {},
  signup: async () => {},
  linkAccount: async () => {},
  logout: async () => {},
  clearError: () => {},
  refreshAuth: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { authService, accountRepo, testerRepo, isInitialized } = useData();
  const [account, setAccount] = useState<LocalAccount | null>(null);
  const [tester, setTester] = useState<TesterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [legacyTesters, setLegacyTesters] = useState<TesterProfile[]>([]);

  const restoreSession = async () => {
    if (!accountRepo || !testerRepo) return;
    setIsLoading(true);
    try {
      // 1. Read active account ID
      const activeAccountId = await accountRepo.getPreference('active_account_id');
      if (activeAccountId) {
        const acc = await accountRepo.getById(activeAccountId);
        if (acc && !acc.disabled) {
          const t = await testerRepo.getById(acc.testerId);
          if (t) {
            setAccount(acc);
            setTester(t);
            setIsLoading(false);
            return;
          }
        }
      }
      // If validation fails, clear preference
      await accountRepo.setPreference('active_account_id', '');
      await accountRepo.setPreference('active_tester_id', '');
      setAccount(null);
      setTester(null);

      // Check for legacy testers with no account
      const allTesters = await testerRepo.listAll();
      const unlinked: TesterProfile[] = [];
      for (const t of allTesters) {
        const hasAcc = await accountRepo.getByTesterId(t.localId);
        if (!hasAcc) unlinked.push(t);
      }
      setLegacyTesters(unlinked);
    } catch (err) {
      console.error('Session restoration failed:', err);
      setAccount(null);
      setTester(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      restoreSession();
    }
  }, [isInitialized]);

  const login = async (email: string, pass: string) => {
    if (!authService) throw new Error('Auth system not initialized');
    setError(null);
    try {
      const res = await authService.login(email, pass);
      setAccount(res.account);
      setTester(res.tester);
    } catch (err: any) {
      setError(err.message || 'Incorrect email or password');
      throw err;
    }
  };

  const signup = async (
    email: string,
    pass: string,
    testerData: Omit<TesterProfile, 'localId' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'recordVersion' | 'syncState'>
  ) => {
    if (!authService) throw new Error('Auth system not initialized');
    setError(null);
    try {
      const res = await authService.signup(email, pass, testerData);
      setAccount(res.account);
      setTester(res.tester);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      throw err;
    }
  };

  const linkAccount = async (testerId: string, email: string, pass: string) => {
    if (!authService) throw new Error('Auth system not initialized');
    setError(null);
    try {
      const res = await authService.linkAccountToExistingTester(testerId, email, pass);
      setAccount(res.account);
      setTester(res.tester);
      setLegacyTesters(prev => prev.filter(t => t.localId !== testerId));
    } catch (err: any) {
      setError(err.message || 'Account linking failed');
      throw err;
    }
  };

  const logout = async () => {
    if (!authService) return;
    setError(null);
    try {
      await authService.logout();
      setAccount(null);
      setTester(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        account,
        tester,
        isLoading,
        error,
        legacyTesters,
        login,
        signup,
        linkAccount,
        logout,
        clearError: () => setError(null),
        refreshAuth: restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
