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
