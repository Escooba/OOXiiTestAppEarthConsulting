import { describe, it, expect } from 'vitest';
import { translate, LANGUAGES, LanguageCode } from '../i18n';

describe('i18n Module Tests', () => {
  it('should only expose English and Spanish in LANGUAGES registry', () => {
    const keys = Object.keys(LANGUAGES);
    expect(keys).toEqual(['en', 'es']);
    expect(LANGUAGES.en).toBe('English');
    expect(LANGUAGES.es).toBe('Español');
  });

  it('should translate keys accurately in English', () => {
    expect(translate('en', 'ui.next')).toBe('Next');
    expect(translate('en', 'ui.back')).toBe('Back');
    expect(translate('en', 'ui.settings')).toBe('Settings');
    expect(translate('en', 'garden.title')).toBe('Garden');
  });

  it('should translate keys accurately in Spanish', () => {
    expect(translate('es', 'ui.next')).toBe('Siguiente');
    expect(translate('es', 'ui.back')).toBe('Atrás');
    expect(translate('es', 'ui.settings')).toBe('Configuración');
    expect(translate('es', 'garden.title')).toBe('Jardín');
  });

  it('should support template parameter interpolation', () => {
    expect(translate('en', 'home.welcome', { name: 'John' })).toBe('Welcome John');
    expect(translate('es', 'home.welcome', { name: 'Maria' })).toBe('Bienvenido Maria');

    expect(translate('en', 'clients.count', { count: 5 })).toBe('5 clients');
    expect(translate('es', 'clients.count', { count: 5 })).toBe('5 pacientes');
  });

  it('should fallback to English if a key is missing in Spanish dictionary', () => {
    // Cast a key to test fallback behavior
    const result = translate('es', 'non_existent_key' as any);
    expect(result).toBe('non_existent_key');
  });
});
