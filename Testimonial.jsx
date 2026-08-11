/* LEAD Testimonial
   Ink card, quote in Medium, attribution in accent uppercase.
   Keep the quote to two lines. Cut it down rather than shrinking the type. */

import React from 'react';

export default function Testimonial({ quote, attribution, className = '' }) {
  return (
    <figure className={`bg-ink rounded-lg p-8 ${className}`}>
      <blockquote className="font-sans text-lead text-white m-0">{quote}</blockquote>
      <figcaption className="font-sans text-label text-accent mt-4">{attribution}</figcaption>
    </figure>
  );
}
