/* LEAD DotGrid, signature device
   22px spacing, ink at 13 percent opacity. Sits behind heroes and dark bands
   to signal structure. Never at full strength behind body copy. */

import React from 'react';

export default function DotGrid({ onDark = false, className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: onDark
          ? 'radial-gradient(circle, rgba(233,221,199,0.16) 1.6px, transparent 1.6px)'
          : 'radial-gradient(circle, rgba(0,35,47,0.13) 1.6px, transparent 1.6px)',
        backgroundSize: '22px 22px'
      }}
    />
  );
}
