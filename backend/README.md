# WarAide — Backend

API REST pour l'application mobile WarAide (Abidjan). Backend en Node.js + Express, base SQLite (conçue pour migrer vers PostgreSQL).

**Contenu**
- Présentation
- Prérequis
- Installation & exécution
- Migrations & seed
- Endpoints API
- Architecture
- Algorithme d'itinéraire (Dijkstra)
- Tests

## Présentation

Ce dépôt contient uniquement le backend : API REST pour gérer les gares, les liaisons et la recherche d'itinéraires optimisés par prix ou temps.

## Prérequis

- Node.js 18+ (ou version compatible)
- npm

## Installation

1. Installer les dépendances :

```bash
npm --prefix backend install
```

2. Copier le fichier d'exemple des variables d'environnement si nécessaire :

```bash
cp backend/.env.example .env
```

3. Lancer les migrations et seed (crée `database/waraide.db`) :

```bash
npm --prefix backend run db:migrate
npm --prefix backend run db:seed
```

4. Démarrer le serveur en développement :

```bash
npm --prefix backend run dev
```

## Variables d'environnement

Exemple (fichier `backend/.env.example` ou `.env` à la racine) :

- `PORT` — port du serveur (défaut 3001)
- `DATABASE_PATH` — chemin SQLite (défaut `database/waraide.db`)
- `NODE_ENV` — `development|production|test`
- `JWT_SECRET`, `JWT_EXPIRES_IN` — configuration auth

## Scripts utiles

- `npm --prefix backend start` : démarre le serveur
- `npm --prefix backend run dev` : démarre en mode watch
- `npm --prefix backend run db:migrate` : applique les migrations
- `npm --prefix backend run db:seed` : exécute le seed depuis `database/*.csv`
- `npm --prefix backend test` : lance la suite de tests

## Migrations & Schéma

Les migrations SQL se trouvent dans `backend/src/migrations/` et un schéma consolidé `backend/db/schema.sql`.

Tables principales :
- `gares` (id, nom, type, categorie, latitude, longitude)
- `liaisons` (id, gare_depart_id, gare_arrivee_id, transport, direction, prix, temps)
- `utilisateurs`

Des index utiles sont créés pour accélérer les recherches (nom, transport, clés étrangères).

## Endpoints API

Base : `http://localhost:<PORT>`

Gares
- GET `/gares` — lister toutes les gares. Query: `nom` (recherche partielle)
- GET `/gares/:id` — récupérer une gare
- POST `/gares` — créer une gare
  - body: `{ nom, type?, categorie?, latitude?, longitude? }`
- PUT `/gares/:id` — modifier une gare
- DELETE `/gares/:id` — supprimer (échec si liaisons existantes)
- GET `/gares/proches?lat=<>&lng=<>&limit=<>` — rechercher gares triées par distance

Liaisons
- GET `/liaisons` — lister liaisons (filtrable par `transport`, `gare_depart_id`, `gare_arrivee_id`)
- GET `/liaisons/:id` — détail
- POST `/liaisons` — créer
  - body: `{ gare_depart_id, gare_arrivee_id, transport, direction, prix, temps }`
- PUT `/liaisons/:id` — mettre à jour
- DELETE `/liaisons/:id` — supprimer

Itinéraire
- POST `/itineraire` — recherche d'itinéraire optimal
  - body: `{ departId, arriveeId, critere? }` où `critere` ∈ `['prix','temps']` (défaut `prix`)
  - Réponse: chemin étape par étape, `prixTotal`, `tempsTotal`, gare départ/arrivée

Authentification (utilisateurs)
- POST `/auth/register` — enregistrer (retourne token)
- POST `/auth/login` — authentifier
- GET `/auth/me` — profil connecté (Bearer token)

Réponses d'erreur standardisées :
- 400 Validation (`VALIDATION_ERROR`)
- 404 Ressource introuvable
- 409 Conflit (doublon / suppression impossible)

## Architecture (dossiers clés)

- `backend/src/controllers` : gestion des routes
- `backend/src/services` : logique métier (incl. `itineraire.service.js`)
- `backend/src/repositories` : accès DB
- `backend/src/db` : connexion, migrations, seed
- `backend/src/algorithms` : `dijkstra.js`
- `backend/src/validators` et `middlewares`

## Algorithme d'itinéraire

L'algorithme utilise Dijkstra :
- Nœuds = gares
- Arêtes = liaisons (pondérées par `prix` ou `temps` selon le critère)
- Retourne le chemin complet (`etapes`) avec coût total et temps total.

Le code se trouve dans `backend/src/algorithms/dijkstra.js` et la construction du graphe dans `backend/src/utils/graphBuilder.js`.

## Tests

Les tests d'intégration et unitaires utilisent `node:test` + `supertest`.

```bash
npm --prefix backend test
```

Les tests exécutés vont créer une base temporaire en `os.tmpdir()` et ne modifient pas la base de développement.

## Prochaines améliorations possibles

- Migration vers PostgreSQL (adapter `src/config/database.js` + installer `pg`)
- Pagination & filtres avancés pour les listes
- Auth + rôles plus fins
- Observabilité (logs structurés, métriques)

---
Si tu veux, je peux maintenant :
- créer un commit Git avec ces changements, ou
- générer une documentation OpenAPI/Swagger à partir des routes.
# WarAide Backend

API REST pour l'application mobile WarAide (Abidjan) — gestion des gares, liaisons de transport et calcul d'itinéraires optimaux.

## Stack

- **Node.js** + **Express.js**
- **SQLite** (`better-sqlite3`) — architecture prête pour PostgreSQL
- Algorithme de **Dijkstra** (optimisation par prix ou temps)

## Prérequis

- Node.js 18+
- npm

## Installation

```bash
cd backend
npm install
cp .env.example .env
```

## Lancement

```bash
npm start
# ou en mode watch
npm run dev
```

Au démarrage, le serveur :
1. Exécute les migrations SQL (`src/migrations/`)
2. Importe les données CSV si la base est vide (`database/points.csv`, `database/liaisons.csv`)

Le serveur écoute par défaut sur **http://localhost:3001**.

## Scripts

| Commande        | Description                          |
|-----------------|--------------------------------------|
| `npm start`     | Démarre le serveur                   |
| `npm run dev`   | Démarre avec rechargement automatique |
| `npm test`      | Tests unitaires + intégration API    |
| `npm run db:migrate` | Applique les migrations         |
| `npm run db:seed`    | Importe les CSV (si base vide)  |

## Variables d'environnement

| Variable         | Défaut                    | Description              |
|------------------|---------------------------|--------------------------|
| `PORT`           | `3001`                    | Port HTTP                |
| `NODE_ENV`       | `development`             | Environnement            |
| `DATABASE_PATH`  | `../database/waraide.db`  | Chemin SQLite            |
| `CORS_ORIGIN`    | `*`                       | Origine CORS autorisée   |

## Architecture

```text
src/
├── config/          # Configuration
├── db/              # Connexion, migrations, seed
├── migrations/      # Fichiers SQL versionnés
├── repositories/    # Accès données (SQL)
├── services/        # Logique métier
├── algorithms/      # Dijkstra
├── controllers/     # Couche HTTP
├── routes/          # Routes Express
├── middlewares/     # Erreurs, validation
├── validators/      # express-validator
└── errors/          # AppError
```

## Endpoints

### Santé

#### `GET /health`

Vérifie que le serveur répond.

**Réponse 200 :**
```json
{ "status": "ok", "service": "waraide-backend" }
```

---

### Gares

#### `GET /gares`

Liste toutes les gares.

**Query params :**
| Param | Type   | Description              |
|-------|--------|--------------------------|
| `nom` | string | Recherche partielle par nom |

**Exemple :** `GET /gares?nom=Petro`

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": 2,
      "nom": "Gare Petro-Ivoire",
      "type": "gare",
      "categorie": "transport",
      "latitude": 5.404328,
      "longitude": -3.990342,
      "created_at": "2026-06-21 10:00:00",
      "updated_at": null
    }
  ],
  "count": 1
}
```

#### `GET /gares/:id`

Retourne une gare par son ID.

**Réponse 200 :** `{ "data": { ... } }`  
**Réponse 404 :** Gare introuvable

#### `POST /gares`

Crée une gare.

**Body :**
```json
{
  "nom": "Gare Plateau",
  "type": "gare",
  "categorie": "transport",
  "latitude": 5.32,
  "longitude": -4.01
}
```

**Réponse 201 :** `{ "data": { ... } }`  
**Réponse 409 :** Nom déjà existant

#### `PUT /gares/:id`

Met à jour une gare (champs partiels acceptés).

**Réponse 200 :** `{ "data": { ... } }`

#### `DELETE /gares/:id`

Supprime une gare (refusée si des liaisons y sont rattachées).

**Réponse 204 :** Suppression réussie  
**Réponse 409 :** Gare liée à des liaisons

---

### Liaisons

#### `GET /liaisons`

Liste toutes les liaisons.

**Query params (optionnels) :**
| Param             | Description           |
|-------------------|-----------------------|
| `transport`       | Filtrer par transport |
| `gare_depart_id`  | Filtrer par départ    |
| `gare_arrivee_id` | Filtrer par arrivée   |

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": 1,
      "gare_depart_id": 1,
      "gare_arrivee_id": 2,
      "transport": "worowo",
      "direction": "Petro-Ivoire",
      "prix": 300,
      "temps": 8,
      "depart_nom": "Gare 9 Kilo",
      "arrivee_nom": "Gare Petro-Ivoire"
    }
  ],
  "count": 29
}
```

#### `GET /liaisons/:id`

Détail d'une liaison.

#### `POST /liaisons`

Crée une liaison.

**Body :**
```json
{
  "gare_depart_id": 1,
  "gare_arrivee_id": 2,
  "transport": "worowo",
  "direction": "Petro-Ivoire",
  "prix": 300,
  "temps": 8
}
```

**Réponse 201 :** `{ "data": { ... } }`

#### `PUT /liaisons/:id`

Met à jour une liaison.

#### `DELETE /liaisons/:id`

Supprime une liaison.

---

### Itinéraire

#### `POST /itineraire`

Calcule le meilleur trajet entre deux gares avec l'algorithme de Dijkstra.

**Body :**
```json
{
  "departId": 1,
  "arriveeId": 11,
  "critere": "prix"
}
```

| Champ       | Type   | Requis | Description                    |
|-------------|--------|--------|--------------------------------|
| `departId`  | int    | oui    | ID gare de départ              |
| `arriveeId` | int    | oui    | ID gare / destination d'arrivée |
| `critere`   | string | non    | `"prix"` (défaut) ou `"temps"` |

**Réponse 200 :**
```json
{
  "data": {
    "critere": "prix",
    "prixTotal": 900,
    "tempsTotal": 23,
    "depart": { "id": 1, "nom": "Gare 9 Kilo" },
    "arrivee": { "id": 11, "nom": "BEM Abidjan" },
    "etapes": [
      {
        "ordre": 1,
        "liaisonId": 1,
        "depart": { "id": 1, "nom": "Gare 9 Kilo" },
        "arrivee": { "id": 2, "nom": "Gare Petro-Ivoire" },
        "transport": "worowo",
        "direction": "Petro-Ivoire",
        "prix": 300,
        "temps": 8
      }
    ]
  }
}
```

**Réponse 404 :** Aucun itinéraire trouvé

---

### Authentification — `/auth`

#### `POST /auth/register`

Crée un compte utilisateur.

**Body :**
```json
{
  "name": "Aya Konan",
  "email": "aya@example.com",
  "password": "secret123"
}
```

**Réponse 201 :**
```json
{
  "data": {
    "user": { "id": 1, "nom": "Konan", "prenom": "Aya", "email": "aya@example.com" },
    "token": "eyJ..."
  }
}
```

#### `POST /auth/login`

**Body :** `{ "email": "...", "password": "..." }`

**Réponse 200 :** même format que register.

#### `GET /auth/me`

Profil de l'utilisateur connecté. Header : `Authorization: Bearer <token>`

---

## Gestion des erreurs

Toutes les erreurs renvoient un JSON structuré :

```json
{
  "error": {
    "message": "Gare introuvable",
    "code": "GARE_NOT_FOUND"
  }
}
```

Erreurs de validation (400) :

```json
{
  "error": {
    "message": "Données invalides",
    "code": "VALIDATION_ERROR",
    "details": [
      { "msg": "departId requis", "path": "departId", "location": "body" }
    ]
  }
}
```

## Schéma base de données

### `gares`
Points du réseau (gares, destinations, points relais).

### `liaisons`
Arêtes orientées du graphe avec prix et temps.

### Index
- `idx_gares_nom` — recherche par nom
- `idx_liaisons_depart` / `idx_liaisons_arrivee` — jointures et Dijkstra
- Contrainte unique sur `(gare_depart_id, gare_arrivee_id, transport, direction)`

## Algorithme d'itinéraire

- **Nœuds** : gares (`gares.id`)
- **Arêtes** : liaisons dirigées (`gare_depart_id` → `gare_arrivee_id`)
- **Poids** : `prix` ou `temps` selon le critère
- **Algorithme** : Dijkstra avec file de priorité (min-heap)
- **Sortie** : chemin étape par étape, prix total, temps total

## Évolution PostgreSQL

1. Remplacer `better-sqlite3` par `pg` dans `src/db/connection.js`
2. Adapter les types SQL (`SERIAL`, `TIMESTAMP WITH TIME ZONE`)
3. Les repositories et services restent inchangés

## Exemples curl

```bash
# Liste des gares
curl http://localhost:3001/gares

# Recherche par nom
curl "http://localhost:3001/gares?nom=Maryse"

# Itinéraire le moins cher
curl -X POST http://localhost:3001/itineraire \
  -H "Content-Type: application/json" \
  -d '{"departId": 1, "arriveeId": 11, "critere": "prix"}'

# Itinéraire le plus rapide
curl -X POST http://localhost:3001/itineraire \
  -H "Content-Type: application/json" \
  -d '{"departId": 9, "arriveeId": 8, "critere": "temps"}'
```
