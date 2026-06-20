import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import MapBox from '../components/MapBox.jsx';
import api from '../services/api.js';

const categories = [
  { id: 'ecole', label: 'École / Univ.' },
  { id: 'entreprise', label: 'Entreprise' },
  { id: 'autre', label: 'Autre' },
];

export default function AddEstablishment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: '', quartier: '', categorie: 'ecole' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.submitEstablishment(form);
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="wa-header">
        <button className="wa-back" onClick={() => navigate(-1)}>
          <i className="ti ti-chevron-left" />
        </button>
        <h1>Ajouter un établissement</h1>
      </div>

      <form className="wa-body" onSubmit={handleSubmit}>
        <p style={{ fontSize: 12, color: 'var(--wa-text-muted)', margin: '0 0 18px', lineHeight: 1.6 }}>
          Ajoutez une école, une entreprise ou un lieu fixe pour que la communauté
          puisse aussi y calculer ses trajets.
        </p>

        <Input
          label="Nom de l'établissement"
          placeholder="ex: Université FHB"
          value={form.nom}
          onChange={update('nom')}
          required
        />

        <Input
          label="Quartier / commune"
          placeholder="ex: Cocody"
          value={form.quartier}
          onChange={update('quartier')}
          required
        />

        <span className="wa-label">Localisation sur la carte</span>
        <MapBox height={110}>
          <i className="ti ti-map-pin-plus" style={{ color: 'var(--wa-orange)', fontSize: 26 }} />
        </MapBox>

        <span className="wa-label">Catégorie</span>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {categories.map((c) => {
            const active = form.categorie === c.id;
            return (
              <button
                type="button"
                key={c.id}
                onClick={() => setForm((f) => ({ ...f, categorie: c.id }))}
                style={{
                  flex: 1,
                  padding: 10,
                  background: active ? 'var(--wa-orange-bg)' : 'var(--wa-surface)',
                  border: `1px solid ${active ? 'var(--wa-orange)' : 'var(--wa-border-soft)'}`,
                  borderRadius: 10,
                  color: active ? 'var(--wa-orange-soft)' : 'var(--wa-text-muted)',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <Button type="submit" icon="ti-send" disabled={submitting}>
          {submitting ? 'Envoi…' : 'Soumettre pour validation'}
        </Button>

        {done && (
          <p style={{ fontSize: 12, color: 'var(--wa-green)', textAlign: 'center', marginTop: 12 }}>
            Merci ! Votre établissement sera vérifié par l'équipe WarAide.
          </p>
        )}

        <p style={{ fontSize: 11, color: 'var(--wa-text-dim)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
          Les établissements ajoutés sont vérifiés par l'équipe WarAide avant publication.
        </p>
      </form>
    </>
  );
}
