import type { Migration } from './types';

export const migration004: Migration = {
  version: 4,
  name: 'seed_global_carrots',
  up: `
UPDATE community_garden_cache 
SET total_community_carrots = 14839, total_completed_tests = 4946
WHERE cache_key = 'global';
`,
};
