/* LEAD OverflowRing
   Progress against a target, drawn so that beating the target reads
   differently from just hitting it. Below 100 the accent ring partly fills.
   At 100 it closes. Above 100 a second cream ring orbits inside it showing
   the surplus, so a team over target does not look the same as a team on it.

   Percent is progress against target, not the raw figure. Pass 114 for
   £170.4k against a £150k target. */

import React from 'react';

export default function OverflowRing({
  percent,
  size = 96,
  strokeWidth = 6,
  showLabel = true,
  className = ''
}) {
  const padding = 8;
  const mainR = size / 2 - padding;
  const c = size / 2;

  const circ = 2 * Math.PI * mainR;
  const mainOffset = circ * (1 - Math.min(percent, 100) / 100);

  const showOver = percent > 100;
  const overR = mainR - strokeWidth - 3;
  const overCirc = 2 * Math.PI * overR;
  const overOffset = overCirc * (1 - Math.min(Math.max(0, percent - 100), 100) / 100);

  const label = showLabel && size >= 80;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${percent} per cent of target`}
    >
      <g transform={`rotate(-90 ${c} ${c})`}>
        <circle
          cx={c}
          cy={c}
          r={mainR}
          fill="none"
          stroke="rgba(233,221,199,0.12)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={c}
          cy={c}
          r={mainR}
          fill="none"
          stroke="#E97132"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={mainOffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        {showOver && (
          <circle
            cx={c}
            cy={c}
            r={overR}
            fill="none"
            stroke="#E9DDC7"
            strokeWidth={strokeWidth * 0.7}
            strokeLinecap="round"
            strokeDasharray={overCirc}
            strokeDashoffset={overOffset}
            style={{ transition: 'stroke-dashoffset 0.7s ease 0.15s' }}
          />
        )}
      </g>
      {label && (
        <text
          x={c}
          y={c}
          fill="#E9DDC7"
          fontFamily="Montserrat, system-ui, sans-serif"
          fontSize={15}
          fontWeight={700}
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {percent}%
        </text>
      )}
    </svg>
  );
}
