/* LEAD FormField
   Label above in uppercase. 8px radius, 1px line border.
   Focus is a 2px accent ring. Errors explain the fix in one sentence
   and never apologise. */

import React from 'react';

export default function FormField({ id, label, type = 'text', error, className = '', ...props }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="font-sans text-label text-ink-muted block mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        aria-invalid={error ? 'true' : undefined}
        className={`font-sans text-body w-full bg-surface rounded px-4 py-3 text-ink
          border ${error ? 'border-error' : 'border-line'}
          focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent`}
        {...props}
      />
      {error && <p className="font-sans text-small text-error mt-2">{error}</p>}
    </div>
  );
}
