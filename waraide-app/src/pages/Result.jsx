import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import calculateRoute from '../utils/routeCalculator.js';
import { formatPrice, formatDuration } from '../utils/formatters.js';
import RouteCard from '../components/cards/RouteCard.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/common/Button.jsx';

export default function Result() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';

  const route = useMemo(() => calculateRoute(from, to), [from, to]);

  return (
    <>
      <div className="wa-header">
        <button className="wa-back" onClick={() => navigate(-1)} aria-label="Retour">
          <i className="ti ti-chevron-left" />
        </button>
        <div>
          <h1 style={{ fontSize: 17 }}>{from} → {to}</h1>
          <p>
            {route.steps.length
              ? `${route.steps.length} étape(s) · ${formatPrice(route.total.prix)} · ~${formatDuration(route.total.temps)}`
              : 'Aucun itinéraire trouvé'}
          </p>
        </div>
      </div>

      <div className="wa-body">
        {!route.found && (
          <Card>
            <p style={{ margin: 0, color: 'var(--wa-text-muted)', fontSize: 13 }}>
              Pas encore de trajet enregistré entre ces deux points. Essayez avec
              une gare proche.
            </p>
          </Card>
        )}

        {route.steps.map((step, i) => (
          <React.Fragment key={i}>
            <RouteCard step={step} />
            {i < route.steps.length - 1 && <div className="wa-divider" />}
          </React.Fragment>
        ))}

        {route.found && route.steps.length > 0 && (
          <>
            <Card style={{ marginTop: 16 }}>
              <div className="wa-price-row">
                <span>Distance estimée</span>
                <span>~{formatDuration(route.total.temps)}</span>
              </div>
              <div className="wa-total-row">
                <span>Total estimé</span>
                <span style={{ color: 'var(--wa-orange)' }}>
                  {formatPrice(route.total.prix)}
                </span>
              </div>
            </Card>

            <Button icon="ti-map" onClick={() => navigate('/map')}>
              Démarrer la navigation
            </Button>
          </>
        )}
      </div>
    </>
  );
}
