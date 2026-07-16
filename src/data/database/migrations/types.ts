// ============================================================================
// Migration interface
// ============================================================================

export interface Migration {
  version: number;
  name: string;
  up: string; // SQL statements separated by semicolons
}
