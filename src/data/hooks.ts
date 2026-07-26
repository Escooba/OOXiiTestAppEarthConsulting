// ============================================================================
// React Hooks — convenient access to database state
// ============================================================================

import { useState, useEffect } from 'react';
import { useData } from './DataProvider';
import type { TesterProfile, Client, TestSession, TesterProgress, CommunityGardenCache, TesterBadge, BadgeDefinition } from './models';

import { useAuthContext } from '../app/lib/AuthProvider';

export function useAuth() {
  const { authService } = useData();
  return authService;
}

export function useTester() {
  const { tester } = useAuthContext();
  return { tester, refresh: async () => {} };
}

export function useProgress() {
  const { progressRepo } = useData();
  const { tester } = useTester();
  const [progress, setProgress] = useState<TesterProgress | null>(null);

  const load = async () => {
    if (tester) setProgress(await progressRepo.getTesterProgress(tester.localId));
  };
  useEffect(() => { load(); }, [tester?.localId]);

  return { progress, refresh: load };
}

export function useGarden() {
  const { gardenRepo } = useData();
  const { tester } = useTester();
  const [cache, setCache] = useState<CommunityGardenCache | null>(null);
  const [localCarrots, setLocalCarrots] = useState(0);

  const load = async () => {
    setCache(await gardenRepo.getCommunityCache());
    if (tester) setLocalCarrots(await gardenRepo.getLocalCarrots(tester.localId));
  };
  useEffect(() => { load(); }, [tester?.localId]);

  return { cache, localCarrots, refresh: load };
}

export function useBadges() {
  const { badgeRepo } = useData();
  const { tester } = useTester();
  const [earned, setEarned] = useState<TesterBadge[]>([]);
  const [definitions, setDefinitions] = useState<BadgeDefinition[]>([]);

  const load = async () => {
    setDefinitions(await badgeRepo.getAllDefinitions());
    if (tester) setEarned(await badgeRepo.getEarnedBadges(tester.localId));
  };
  useEffect(() => { load(); }, [tester?.localId]);

  return { earned, definitions, refresh: load };
}

export function useClients() {
  const { clientRepo } = useData();
  const [clients, setClients] = useState<Client[]>([]);

  const load = async () => setClients(await clientRepo.listRecent(20));
  useEffect(() => { load(); }, []);

  return { clients, refresh: load };
}

export function useActiveSession() {
  const { sessionRepo } = useData();
  const { tester } = useTester();
  const [session, setSession] = useState<TestSession | null>(null);

  const load = async () => {
    if (tester) setSession(await sessionRepo.getActiveSession(tester.localId));
  };
  useEffect(() => { load(); }, [tester?.localId]);

  return { session, refresh: load };
}
