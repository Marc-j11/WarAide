CREATE TABLE points (
    id INTEGER PRIMARY KEY,
    nom TEXT,
    type TEXT,
    categorie TEXT,
    latitude REAL,
    longitude REAL
);

CREATE TABLE liaisons (
    id INTEGER,
    depart VARCHAR(50),
    arrivee VARCHAR(50),
    transport VARCHAR(50),
    direction VARCHAR(50),
    prix INTEGER,
    temps INTEGER
);

CREATE TABLE destinations_reference (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    point_id INTEGER NOT NULL,
    description TEXT,
    FOREIGN KEY (point_id) REFERENCES points(id)
);

CREATE TABLE utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    mot_de_passe TEXT NOT NULL,
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);