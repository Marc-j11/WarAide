import React from 'react';

/**
 * Affiche une étape du trajet.
 * Props:
 *  - step: { type: 'transport'|'walk', from, to, transport?: 'woro'|'gbaka', prix?: number, temps?: number, index?: number }
 */
export default function RouteCard({ step }) {
  if (!step) return null;

  if (step.type === 'walk') {
    return (
      <div className="wa-route-step">
        <div className="wa-route-dot walk">
          <i className="ti ti-walk" style={{ fontSize: 14 }} />
        </div>
        <div style={{ flex: 1, paddingTop: 2 }}>
          <p style={{ fontSize: 12, color: 'var(--wa-text-muted)', margin: 0 }}>
            À pied{step.temps ? ` · ~${step.temps} min` : ''}
          </p>
          <p style={{ fontSize: 13, fontWeight: 500, margin: '2px 0 0', color: 'var(--wa-text)' }}>
            {step.from} → {step.to}
          </p>
        </div>
      </div>
    );
  }

  const isGbaka = step.transport === 'gbaka';
  const badgeClass = isGbaka ? 'blue' : 'orange';
  const icon = isGbaka ? 'ti-bus' : 'ti-car';
  const label = isGbaka ? 'Gbaka' : 'Woro woro';

  return (
    <div className="wa-route-step">
      <div className="wa-route-dot">{step.index ?? '•'}</div>
      <div style={{ flex: 1, paddingTop: 2 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--wa-text)' }}>
          {step.from} → {step.to}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 4,
          }}
        >
          <span className={`wa-badge ${badgeClass}`}>
            <i className={`ti ${icon}`} style={{ fontSize: 10 }} /> {label}
          </span>
          {step.prix != null && (
            <span style={{ fontSize: 13, color: 'var(--wa-orange)', fontWeight: 500 }}>
              {step.prix} F
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
