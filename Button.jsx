/* LEAD Button
   One primary button per view. Label with the action, not the outcome:
   "Book a call", not "Get started". Hover darkens, never changes colour family. */

import React from 'react';

const base =
  'inline-flex items-center justify-center font-sans text-button rounded ' +
  'transition-colors duration-150 focus-visible:outline focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-accent';

const variants = {
  // Ink label on accent. 5.4 to 1, safe at any size.
  primary: 'bg-accent text-ink px-6 py-3 hover:bg-[#D9631F]',
  // Use on cream and canvas sections where accent is already spent elsewhere.
  dark: 'bg-ink text-white px-6 py-3 hover:bg-ink-deep',
  secondary: 'bg-transparent text-ink border-2 border-ink px-6 py-[10px] hover:bg-ink hover:text-white',
  ghost: 'text-ink border-b-2 border-accent rounded-none px-0 py-1 hover:text-accent-text'
};

export default function Button({ variant = 'primary', href, children, className = '', ...props }) {
  const classes = `${base} ${variants[variant] || variants.primary} ${className}`;
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
