/* LEAD Highlight, signature device
   The orange highlighter. One per screen, on the single most important phrase.
   "block" fills behind the words, "underline" draws the swipe under them.
   On the web it animates left to right on load. */

import React from 'react';

export default function Highlight({ variant = 'block', children, className = '' }) {
  if (variant === 'underline') {
    return (
      <span
        className={`box-decoration-clone ${className}`}
        style={{ boxShadow: 'inset 0 -0.28em 0 rgba(233,113,50,0.75)' }}
      >
        {children}
      </span>
    );
  }
  return (
    <span className={`bg-accent text-ink px-2 box-decoration-clone ${className}`}>{children}</span>
  );
}
