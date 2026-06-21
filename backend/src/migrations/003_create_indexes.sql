CREATE INDEX IF NOT EXISTS idx_gares_nom ON gares(nom);
CREATE INDEX IF NOT EXISTS idx_gares_type ON gares(type);
CREATE INDEX IF NOT EXISTS idx_liaisons_depart ON liaisons(gare_depart_id);
CREATE INDEX IF NOT EXISTS idx_liaisons_arrivee ON liaisons(gare_arrivee_id);
CREATE INDEX IF NOT EXISTS idx_liaisons_transport ON liaisons(transport);
CREATE UNIQUE INDEX IF NOT EXISTS idx_liaisons_unique
    ON liaisons(gare_depart_id, gare_arrivee_id, transport, direction);
