/* LEAD Eyebrow
   Small label above a headline. Always uppercase, always accent-text.
   Encodes something true about the content, for example a pillar number. */

import React from 'react';

export default function Eyebrow({ children, onDark = false, className = '' }) {
  return (
    <p
      className={`font-sans text-eyebrow uppercase mb-3 ${
        onDark ? 'text-accent' : 'text-accent-text'
      } ${className}`}
    >
      {children}
    </p>
  );
}
