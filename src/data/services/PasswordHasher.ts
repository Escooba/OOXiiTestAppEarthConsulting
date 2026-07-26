// ============================================================================
// PasswordHasher — Offline PBKDF2 Password Hashing
// ============================================================================

export interface HashResult {
  hashHex: string;
  saltHex: string;
  algorithm: string;
  iterations: number;
}

export class PasswordHasher {
  private static ITERATIONS = 100000;
  private static ALGORITHM = 'PBKDF2-HMAC-SHA-256';

  static async hash(password: string, saltHex?: string): Promise<HashResult> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );

    let salt: Uint8Array;
    if (saltHex) {
      salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))) as any;
    } else {
      salt = new Uint8Array(16) as any;
      crypto.getRandomValues(salt as any);
    }

    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt as any,
        iterations: this.ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computedHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    const finalSaltHex = saltHex || Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');

    return {
      hashHex: computedHashHex,
      saltHex: finalSaltHex,
      algorithm: this.ALGORITHM,
      iterations: this.ITERATIONS
    };
  }

  static async verify(password: string, storedHashHex: string, saltHex: string): Promise<boolean> {
    const result = await this.hash(password, saltHex);
    // Timing-safe comparison could be implemented, but simple string compare is often enough for local offline clients.
    // We do a simple comparison for now, though best practice is constant time.
    if (result.hashHex.length !== storedHashHex.length) return false;
    let mismatch = 0;
    for (let i = 0; i < result.hashHex.length; i++) {
      mismatch |= (result.hashHex.charCodeAt(i) ^ storedHashHex.charCodeAt(i));
    }
    return mismatch === 0;
  }
}
