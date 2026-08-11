/* LEAD Card
   Surface or canvas background, 16px radius, 1px line border, 32px padding.
   Optional eyebrow, a short title, one short paragraph. Nothing more. */

import React from 'react';
import Eyebrow from './Eyebrow';

const tones = {
  surface: 'bg-surface border-line text-ink-body',
  canvas: 'bg-canvas border-line text-ink-body',
  cream: 'bg-cream border-[#D9C9AC] text-ink-body',
  ink: 'bg-ink border-ink text-[#C9D6DA]'
};

export default function Card({ tone = 'surface', eyebrow, title, children, className = '' }) {
  const onDark = tone === 'ink';
  return (
    <div className={`border rounded-lg p-8 shadow-sm ${tones[tone]} ${className}`}>
      {eyebrow && <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow>}
      {title && (
        <h3 className={`font-sans text-h3 mb-2 ${onDark ? 'text-white' : 'text-ink'}`}>{title}</h3>
      )}
      {children && <div className="font-sans text-body lead-measure">{children}</div>}
    </div>
  );
}
