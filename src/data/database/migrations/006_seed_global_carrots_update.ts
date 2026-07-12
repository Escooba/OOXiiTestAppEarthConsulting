import type { Migration } from './types';

export const migration006: Migration = {
  version: 6,
  name: 'seed_global_carrots_update',
  up: `
UPDATE community_garden_cache 
SET total_community_carrots = 1115, total_completed_tests = 1115
WHERE cache_key = 'global';
`,
};
