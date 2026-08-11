/* LEAD StatBlock, signature device
   The big number. Black weight, ink numeral, accent unit. One per section.
   Use a real figure with a plain label, never a vanity metric. */

import React from 'react';

export default function StatBlock({ value, unit, label, onDark = false, className = '' }) {
  return (
    <div className={className}>
      <p className={`font-sans text-stat ${onDark ? 'text-white' : 'text-ink'}`}>
        {value}
        {unit && <span className="text-accent">{unit}</span>}
      </p>
      <p className={`font-sans text-label mt-2 ${onDark ? 'text-cream' : 'text-ink-muted'}`}>
        {label}
      </p>
    </div>
  );
}
