// ============================================================================
// OOXii Data Models — Type definitions for the local SQLite persistence layer
// ============================================================================

// ---------------------------------------------------------------------------
// Enums / Constrained string unions
// ---------------------------------------------------------------------------

export type SessionStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';
export type SyncState = 'local' | 'pending' | 'synced' | 'conflict';
export type SectionType =
  | 'pretest'
  | 'main_test'
  | 'post_test'
  | 'dispensing'
  | 'completion'
  | 'region_selection'
  | 'ui_context';

export type EyeContext = 'right' | 'left' | 'both' | 'near_binocular';
export type CorrectionContext =
  | 'no_glasses'
  | 'own_glasses'
  | 'wheel'
  | 'paddle'
  | 'paddle_at_wheel';

export type CarrotEventType = 'test_completed' | 'manual_adjustment' | 'sync_correction';

export type BadgeCode =
  | 'FIRST_VISION'
  | 'TEN_HELPERS'
  | 'VISION_GUIDE'
  | 'COMMUNITY_PILLAR'
  | 'FIELD_CHAMPION'
  | 'VISION_LEGEND';

export type BadgeRuleType =
  | 'completed_tests'
  | 'distinct_testing_days'
  | 'clients_helped'
  | 'carrots_earned'
  | 'eye_festivals_attended'
  | 'custom_counter';

export type SyncOperationType = 'upsert' | 'delete';
export type SyncOperationStatus = 'pending' | 'processing' | 'failed' | 'completed';
export type SyncConflictResolution = 'unresolved' | 'local_wins' | 'remote_wins' | 'merged' | 'manual';

export type DispensedItemCategory =
  | 'wheel_glasses'
  | 'paddle_glasses'
  | 'paddle_at_wheel_glasses'
  | 'sunglasses'
  | 'distance_glasses'
  | 'reading_glasses';

// ---------------------------------------------------------------------------
// Entity Models
// ---------------------------------------------------------------------------

export interface AppMetadata {
  installationId: string;
  dbSchemaVersion: number;
  createdAt: number; // UTC epoch ms
  lastOpenedAt: number;
  lastSuccessfulSyncAt: number | null;
}

export interface TesterProfile {
  localId: string;
  remoteId: string | null;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  experienceLevel: string;
  organisation: string;
  country: string;
  stateProvince: string;
  city: string;
  firstLoginGuideCompleted: boolean;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
  recordVersion: number;
  syncState: SyncState;
}

export interface Clinic {
  localId: string;
  remoteId: string | null;
  clinicName: string;
  country: string;
  stateProvince: string;
  city: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
  recordVersion: number;
  syncState: SyncState;
}

export interface Client {
  localId: string;
  remoteId: string | null;
  ooxiiClientId: string;
  yearOfBirth: number;
  gender: string;
  cataractSurgery: string;
  country: string;
  stateProvince: string;
  city: string;
  createdByTesterId: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
  recordVersion: number;
  syncState: SyncState;
}

export interface TestSession {
  localId: string;
  remoteId: string | null;
  clientId: string;
  testerId: string;
  clinicId: string | null;
  displayTestNumber: string;
  status: SessionStatus;
  currentRoute: string | null;
  activeTestModule: string | null;
  isGroupTesting: boolean;
  testSchemaVersion: number;
  startedAt: number;
  completedAt: number | null;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
  recordVersion: number;
  syncState: SyncState;
}

export interface TestSessionSection {
  localId: string;
  testSessionId: string;
  sectionType: SectionType;
  sectionSchemaVersion: number;
  payload: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}

export interface VisualAcuityMeasurement {
  localId: string;
  testSessionId: string;
  phase: 'pretest' | 'post_test';
  testMethod: string;
  eyeContext: EyeContext;
  correctionContext: CorrectionContext;
  ooxiiLine: string | null;
  lettersOnNextLine: number | null;
  snellenMetres: string | null;
  snellenImperial: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface Prescription {
  localId: string;
  testSessionId: string;
  eyeSide: 'right' | 'left';
  prescriptionMode: string;
  sphere: string | null;
  cylinder: string | null;
  axis: string | null;
  lensType: string | null;
  addOn: string | null;
  toricPower: string | null;
  toricGauge: string | null;
  bestLensDisplay: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface DispensedItem {
  localId: string;
  testSessionId: string;
  itemCategory: DispensedItemCategory;
  rightLens: string | null;
  leftLens: string | null;
  frameColour: string | null;
  frameFrontColour: string | null;
  rightArmColour: string | null;
  leftArmColour: string | null;
  frameSize: string | null;
  frameType: string | null;
  itemIdentifier: string | null;
  dispensed: boolean;
  priceCents: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface CompletionChecklistItem {
  localId: string;
  testSessionId: string;
  checklistCode: string;
  label: string;
  checked: boolean;
  displayOrder: number;
  createdAt: number;
  updatedAt: number;
}

export interface ClinicalReferral {
  localId: string;
  testSessionId: string;
  enabled: boolean;
  notes: string | null;
  destination: string | null;
  cataractRight: boolean;
  cataractLeft: boolean;
  diabeticRetinopathyRight: boolean;
  diabeticRetinopathyLeft: boolean;
  cornealScarRight: boolean;
  cornealScarLeft: boolean;
  maculopathyRight: boolean;
  maculopathyLeft: boolean;
  glaucomaRight: boolean;
  glaucomaLeft: boolean;
  otherConditionRight: boolean;
  otherConditionLeft: boolean;
  referralUrgency: string | null;
  createdAt: number;
  updatedAt: number;
}

export interface CarrotLedgerEntry {
  localId: string;
  testerId: string;
  eventType: CarrotEventType;
  quantity: number;
  sourceEntityType: string;
  sourceEntityId: string;
  reason: string;
  earnedAt: number;
  createdAt: number;
  syncState: SyncState;
  remoteId: string | null;
}

export interface BadgeDefinition {
  badgeCode: string;
  displayName: string;
  description: string;
  iconKey: string;
  ruleType: BadgeRuleType;
  targetValue: number;
  displayOrder: number;
  enabled: boolean;
  definitionVersion: number;
}

export interface TesterBadge {
  localId: string;
  testerId: string;
  badgeCode: string;
  awardedAt: number;
  sourceEventId: string | null;
  definitionVersionAtAward: number;
  syncState: SyncState;
  remoteId: string | null;
}

export interface TesterProgress {
  completedTests: number;
  clientsHelped: number;
  distinctTestingDays: number;
  totalCarrots: number;
  carrotsWaitingToSync: number;
  badgesEarned: number;
  nextBadge: BadgeDefinition | null;
  progressTowardNext: number;
  remainingForNext: number;
}

export interface CommunityGardenCache {
  cacheKey: string;
  totalCommunityCarrots: number;
  totalCompletedTests: number;
  milestonePayload: string | null;
  sourceUpdateAt: number | null;
  localRetrievalAt: number;
  stale: boolean;
}

export interface SyncOutboxEntry {
  operationId: string;
  entityType: string;
  entityId: string;
  operationType: SyncOperationType;
  entityVersion: number;
  payload: string; // JSON serialised
  createdAt: number;
  attemptCount: number;
  lastAttemptAt: number | null;
  nextAttemptAt: number | null;
  status: SyncOperationStatus;
  lastError: string | null;
  idempotencyKey: string;
}

export interface SyncCheckpoint {
  syncScope: string;
  remoteCursor: string | null;
  lastSuccessfulUploadAt: number | null;
  lastSuccessfulDownloadAt: number | null;
  lastAttemptedSyncAt: number | null;
  lastError: string | null;
}

export interface SyncConflict {
  localId: string;
  entityType: string;
  entityId: string;
  localVersion: number;
  remoteVersion: number;
  localPayload: string;
  remotePayload: string;
  detectedAt: number;
  resolutionState: SyncConflictResolution;
  resolvedAt: number | null;
}

// ---------------------------------------------------------------------------
// Sync transport boundary types
// ---------------------------------------------------------------------------

export interface SyncPushBatch {
  entries: SyncOutboxEntry[];
}

export interface SyncPushResult {
  succeededIds: string[];
  failedIds: { id: string; error: string }[];
}

export interface SyncPullRequest {
  scope: string;
  cursor: string | null;
  limit: number;
}

export interface SyncPullResult {
  entities: { entityType: string; entityId: string; version: number; payload: string; deleted: boolean }[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface SyncTransport {
  push(batch: SyncPushBatch): Promise<SyncPushResult>;
  pull(request: SyncPullRequest): Promise<SyncPullResult>;
  isAvailable(): Promise<boolean>;
}

// ---------------------------------------------------------------------------
// Utility: Generate UUID
// ---------------------------------------------------------------------------

export function generateLocalId(): string {
  // Crypto.randomUUID is available in modern browsers and Node 19+.
  // Fallback for older environments.
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // RFC-4122 v4 fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function nowUtcMs(): number {
  return Date.now();
}
