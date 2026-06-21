PRAGMA foreign_keys = ON;

-- Table: gares
CREATE TABLE IF NOT EXISTS gares (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL DEFAULT 'gare',
    categorie TEXT,
    latitude REAL,
    longitude REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME
);

-- Table: liaisons
CREATE TABLE IF NOT EXISTS liaisons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gare_depart_id INTEGER NOT NULL,
    gare_arrivee_id INTEGER NOT NULL,
    transport TEXT NOT NULL,
    direction TEXT NOT NULL,
    prix INTEGER NOT NULL CHECK (prix >= 0),
    temps INTEGER NOT NULL CHECK (temps >= 0),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (gare_depart_id) REFERENCES gares(id) ON DELETE RESTRICT,
    FOREIGN KEY (gare_arrivee_id) REFERENCES gares(id) ON DELETE RESTRICT,
    CHECK (gare_depart_id != gare_arrivee_id)
);

-- Table: utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    prenom TEXT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    mot_de_passe TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gares_nom ON gares(nom);
CREATE INDEX IF NOT EXISTS idx_gares_type ON gares(type);
CREATE INDEX IF NOT EXISTS idx_liaisons_depart ON liaisons(gare_depart_id);
CREATE INDEX IF NOT EXISTS idx_liaisons_arrivee ON liaisons(gare_arrivee_id);
CREATE INDEX IF NOT EXISTS idx_liaisons_transport ON liaisons(transport);
CREATE UNIQUE INDEX IF NOT EXISTS idx_liaisons_unique
    ON liaisons(gare_depart_id, gare_arrivee_id, transport, direction);
