// ============================================================================
// TestWorkflowService — Orchestrates the lifecycle of a test session
// ============================================================================

import type { TestSessionRepository } from '../repositories/TestSessionRepository';
import type { ClientRepository } from '../repositories/ClientRepository';
import type { TesterRepository } from '../repositories/TesterRepository';
import type { TestSession, SectionType } from '../models';
import {
  validatePretestPayload,
  validateMainTestPayload,
  validatePostTestPayload,
  validateDispensingPayload,
  validateCompletionPayload,
  validateRegionSelectionPayload,
  validateUiContextPayload,
} from '../validation/sectionSchemas';

export class TestWorkflowService {
  constructor(
    public sessionRepo: TestSessionRepository,
    private clientRepo: ClientRepository,
    private testerRepo: TesterRepository
  ) {}

  async startNewTest(testerId: string, clientId: string, clinicId?: string): Promise<TestSession> {
    const tester = await this.testerRepo.getById(testerId);
    if (!tester) throw new Error('Tester not found');

    const client = await this.clientRepo.findByLocalId(clientId);
    if (!client) throw new Error('Client not found');

    return this.sessionRepo.startTest({
      clientId: client.localId,
      testerId: tester.localId,
      clinicId,
    });
  }

  async resumeActiveTest(testerId: string): Promise<TestSession | null> {
    return this.sessionRepo.getActiveSession(testerId);
  }

  async saveProgress(sessionId: string, currentRoute: string, activeModule?: string): Promise<void> {
    await this.sessionRepo.saveCurrentScreen(sessionId, currentRoute, activeModule);
  }

  async saveSection(sessionId: string, sectionType: SectionType, payload: Record<string, unknown>): Promise<void> {
    // Validate payload
    let isValid = false;
    switch (sectionType) {
      case 'pretest': isValid = validatePretestPayload(payload); break;
      case 'main_test': isValid = validateMainTestPayload(payload); break;
      case 'post_test': isValid = validatePostTestPayload(payload); break;
      case 'dispensing': isValid = validateDispensingPayload(payload); break;
      case 'completion': isValid = validateCompletionPayload(payload); break;
      case 'region_selection': isValid = validateRegionSelectionPayload(payload); break;
      case 'ui_context': isValid = validateUiContextPayload(payload); break;
      default: isValid = false;
    }

    if (!isValid) {
      throw new Error(`Invalid payload for section type: ${sectionType}`);
    }

    await this.sessionRepo.saveSection(sessionId, sectionType, payload);
  }

  async saveSectionPatch(sessionId: string, sectionType: SectionType, patch: Record<string, unknown>): Promise<void> {
    if (typeof patch !== 'object' || patch === null) {
      throw new Error(`Invalid patch payload for section type: ${sectionType}`);
    }
    await this.sessionRepo.saveSectionPatch(sessionId, sectionType, patch);
  }

  async cancelTest(sessionId: string): Promise<void> {
    await this.sessionRepo.cancelDraft(sessionId);
  }
}
