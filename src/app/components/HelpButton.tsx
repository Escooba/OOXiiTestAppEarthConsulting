import React, { useState } from 'react';
import { Hand } from 'lucide-react';
import { ApparatusHelpDialog } from './ApparatusHelpDialog';
import {
  getApparatusHelpConfig,
  type ApparatusHelpConfig,
} from '../help/apparatusHelpConfig';

import { useTheme } from '../lib/ThemeContext';

export interface HelpButtonProps {
  configId?: string;
  config?: ApparatusHelpConfig;
  title?: string;
  description?: string;
  imageSrc?: string;
  pulse?: boolean;
  contextLine?: string;
}

export function HelpButton({
  configId,
  config: providedConfig,
  title,
  description,
  imageSrc,
  pulse = false,
  contextLine,
}: HelpButtonProps) {
  const { t } = useTheme();
  const [open, setOpen] = useState(false);

  // Resolve config object
  let resolvedConfig: ApparatusHelpConfig | null = null;

  if (providedConfig) {
    resolvedConfig = providedConfig;
  } else if (configId) {
    resolvedConfig = getApparatusHelpConfig(configId, contextLine);
  }

  // Fallback for custom title/description
  if (!resolvedConfig && title && description) {
    resolvedConfig = {
      id: 'custom-help',
      title,
      instruction: description,
      imageSrc: imageSrc || '',
      imageAlt: title,
      assetKind: 'illustration',
      highlights: [],
    };
  }

  if (!resolvedConfig) return null;

  const titleKey = `help.${resolvedConfig.id}.title` as any;
  const translatedTitle = t(titleKey) !== titleKey ? t(titleKey) : resolvedConfig.title;

  return (
    <>
      <button
        type="button"
        aria-label={`Get help for ${translatedTitle}`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center justify-center gap-2 min-h-[44px] px-3.5 py-2 rounded-full bg-[var(--card)] border border-[var(--primary)]/40 text-[var(--primary)] text-xs font-bold hover:bg-[var(--card-active)] active:scale-95 transition-all shadow-sm shrink-0 ${
          pulse ? 'animate-pulse' : ''
        }`}
      >
        <div className="w-5 h-5 rounded-full border border-[var(--primary)]/60 flex items-center justify-center shrink-0 bg-[var(--primary)]/10">
          <Hand size={11} strokeWidth={2.2} />
        </div>
        <span>{t('ui.help')}</span>
      </button>

      <ApparatusHelpDialog
        open={open}
        onClose={() => setOpen(false)}
        config={resolvedConfig}
      />
    </>
  );
}

export { HelpButton as ApparatusHelpButton };
