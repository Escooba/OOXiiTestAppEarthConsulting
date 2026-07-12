// ============================================================================
// sectionSchemas — lightweight validation for section payloads
// ============================================================================

export function validatePretestPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  // For the prototype, we assume the UI handles strict validation before saving.
  // We just ensure it's a valid record.
  return true;
}

export function validateMainTestPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  return true;
}

export function validatePostTestPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  return true;
}

export function validateDispensingPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  return true;
}

export function validateCompletionPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  return true;
}

export function validateRegionSelectionPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  return true;
}

export function validateUiContextPayload(payload: unknown): boolean {
  if (typeof payload !== 'object' || payload === null) return false;
  return true;
}
