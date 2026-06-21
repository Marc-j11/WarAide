import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import calculateRoute from '../utils/routeCalculator.js';
import api from '../services/api.js';
import { formatPrice, formatDuration } from '../utils/formatters.js';
import RouteCard from '../components/cards/RouteCard.jsx';
import Card from '../components/Card.jsx';
import Button from '../components/common/Button.jsx';
import Loading from '../components/common/Loading.jsx';

const EMPTY_ROUTE = { found: false, steps: [], total: { prix: 0, temps: 0 } };

export default function Result() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const critere = params.get('critere') === 'prix' ? 'prix' : 'temps';

  const [route, setRoute] = useState(EMPTY_ROUTE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!from || !to) {
      setRoute(EMPTY_ROUTE);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadRoute() {
      setLoading(true);

      if (api.isConfigured()) {
        const apiRoute = await api.searchItineraire(from, to, critere);
        if (!cancelled && apiRoute) {
          setRoute(apiRoute);
          setLoading(false);
          return;
        }
      }

      if (!cancelled) {
        setRoute(calculateRoute(from, to));
        setLoading(false);
      }
    }

    loadRoute();
    return () => {
      cancelled = true;
    };
  }, [from, to, critere]);

  if (loading) {
    return (
      <>
        <div className="wa-header">
          <button className="wa-back" onClick={() => navigate(-1)} aria-label="Retour">
            <i className="ti ti-chevron-left" />
          </button>
          <div>
            <h1 style={{ fontSize: 17 }}>{from} → {to}</h1>
            <p>Calcul de l'itinéraire…</p>
          </div>
        </div>
        <div className="wa-body">
          <Loading label="Recherche du meilleur trajet…" />
        </div>
      </>
    );
  }

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
              ? `${route.steps.length} étape(s) · ${formatPrice(route.total.prix)} · ~${formatDuration(route.total.temps)} · ${critere === 'prix' ? 'moins cher' : 'plus rapide'}`
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

            <Button
              icon="ti-map"
              onClick={() => navigate('/map', { state: { route, from, to, critere } })}
            >
              Démarrer la navigation
            </Button>
          </>
        )}
      </div>
    </>
  );
}
