import type { Migration } from './types';

export const migration005: Migration = {
  version: 5,
  name: 'seed_global_carrots_fix',
  up: `
UPDATE community_garden_cache 
SET total_community_carrots = 1345, total_completed_tests = 1345
WHERE cache_key = 'global';
`,
};
