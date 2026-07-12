import React from 'react';

/**
 * Bun — the OOXii rabbit mascot.
 * Renders the fluffy bunny emoji so it matches the illustrated rabbit used
 * throughout the onboarding and profile screens. Use everywhere in place of
 * the old lucide `Rabbit` line icon.
 */
export function RabbitMascot({
  size = 24,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Bun the rabbit"
      className={`inline-block leading-none select-none ${className}`}
      style={{ fontSize: size, lineHeight: 1 }}
    >
      🐰
    </span>
  );
}
