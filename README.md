# WarAide

WarAide est un projet de navigation urbaine et d’aide à la mobilité. Le dépôt contient un backend Node.js/Express minimal, une base de données SQLite et une application frontend React/Vite.

## Architecture du projet

```text
WarAide/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── routes/
 │   ├── package.json
 │   └── server.js
│
├── database/
│   ├── points.csv
│   ├── liaisons.csv
│   ├── README.md
│   ├── schema.sql
│   └── waraide.db
│
├── docs/
│   ├── architecture.md
│   ├── cahier_des_charges.md
│   └── database.md
│
├── waraide-app/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons/
│   │   ├── logo.svg
│   │   └── manifest.json
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
   │   │   │   └── splash-bg.svg
   │   │   └── icons/
   │   │       ├── gbaka.svg
   │   │       ├── woro.svg
   │   │       └── walk.svg
   │   │
   │   ├── components/
   │   │   ├── common/
   │   │   │   ├── Button.jsx
   │   │   │   ├── Button.css
   │   │   │   ├── Input.jsx
   │   │   │   ├── Input.css
   │   │   │   ├── Loading.jsx
   │   │   │   └── Loading.css
   │   │   ├── layout/
   │   │   │   ├── Layout.jsx
   │   │   │   ├── Layout.css
   │   │   │   ├── Navbar.jsx
   │   │   │   └── Navbar.css
   │   │   └── cards/
   │   │       ├── RouteCard.jsx
   │   │       ├── RouteCard.css
   │   │       └── StationCard.jsx
   │   │       └── StationCard.css
   │   │
   │   ├── context/
   │   │   ├── AuthContext.jsx
   │   │   └── StationContext.jsx
   │   │
   │   ├── data/
   │   │   ├── destinations.js
   │   │   ├── index.js
   │   │   ├── liaisons.js
   │   │   └── points.js
   │   │
   │   ├── hooks/
   │   │   ├── useAuth.js
   │   │   ├── useGeolocation.js
   │   │   └── useStations.js
   │   │
   │   ├── pages/
   │   │   ├── AddEstablishment.js
   │   │   ├── Home.js
   │   │   ├── Login.js
   │   │   ├── Map.js
   │   │   ├── Register.js
   │   │   ├── Result.js
   │   │   ├── Search.js
   │   │   └── Stations.js
   │   │
   │   ├── services/
   │   │   └── api.js
   │   │
   │   ├── styles/
   │   │   ├── global.css
   │   │   ├── reset.css
   │   │   ├── theme.css
   │   │   └── variables.css
   │   │
   │   ├── utils/
   │   │   ├── distance.js
   │   │   ├── formatters.js
   │   │   ├── geolocation.js
   │   │   └── routeCalculator.js
   │   │
   │   ├── App.jsx
   │   ├── App.css
   │   ├── index.css
   │   ├── main.jsx
   │   └── routes.jsx
   │
   ├── .env
   ├── .gitignore
   ├── index.html
   ├── package.json
   ├── package-lock.json
   ├── README.md
   └── vite.config.js
│
└── .gitignore
```

## Installation

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd waraide-app
npm install
npm run dev
```

## Notes

- Le dossier `database/` contient les sources de données CSV et la base SQLite.
- Le dossier `backend/` contient le scaffold Express.
- Le dossier `waraide-app/` contient l’application React/Vite.

## Structure détaillée

- `backend/`: API et architecture future
- `database/`: fichiers CSV, schéma SQL et base de données SQLite
- `docs/`: documentation architecture et base de données
- `waraide-app/`: frontend React avec composants, hooks, context, services et styles
