/* LEAD CtaBand
   Closes every page and every deck. Ink field, dot grid, one accent button,
   one line of reassurance underneath. Never two competing actions. */

import React from 'react';
import Button from './Button';
import DotGrid from './DotGrid';

export default function CtaBand({
  heading,
  reassurance,
  buttonLabel = 'Book a call',
  href = 'https://lead-pd.co.uk/book',
  className = ''
}) {
  return (
    <section className={`relative overflow-hidden bg-ink ${className}`}>
      <DotGrid onDark />
      <div className="relative lead-container flex flex-col gap-8 py-24 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-sans text-h2 text-white m-0">{heading}</h2>
          {reassurance && (
            <p className="font-sans text-body text-cream mt-4 lead-measure">{reassurance}</p>
          )}
        </div>
        <Button href={href} variant="primary">
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
