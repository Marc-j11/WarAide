import React from 'react';

/**
 * Boîte de carte (placeholder SVG).
 * Props: height (px), points: [{ x, y, color, label? }], paths: ['M x y ...']
 */
export default function MapBox({ height = 200, points = [], paths = [], children }) {
  const w = 320;
  const h = height;

  return (
    <div className="wa-map-box" style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${w} ${h}`}
        style={{ position: 'absolute', inset: 0 }}
        preserveAspectRatio="none"
      >
        <rect width={w} height={h} fill="var(--wa-map-bg)" />
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="var(--wa-orange)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="6,4"
            strokeLinecap="round"
          />
        ))}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.r || 6} fill={p.color || 'var(--wa-orange)'} />
            {p.label && (
              <text
                x={p.x}
                y={p.y - 10}
                fill="var(--wa-orange-soft)"
                fontSize="10"
                textAnchor="middle"
              >
                {p.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      {children}
    </div>
  );
}
