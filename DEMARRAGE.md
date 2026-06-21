# Démarrer WarAide

## Prérequis

Node.js 18+ installé.

## Installation (une seule fois)

```bash
cd /Users/marcabel/WarAide
npm run install:all
```

## Lancer backend + frontend

**Toujours depuis la racine du projet** (`WarAide/`, pas `backend/`) :

```bash
cd /Users/marcabel/WarAide
npm run dev
```

- Backend : http://localhost:3001
- Frontend : http://localhost:5173

## Si le port 3001 est déjà utilisé

```bash
cd /Users/marcabel/WarAide
npm run stop
npm run dev
```

Le message `EADDRINUSE` signifie que le backend tourne déjà — ouvrez http://localhost:3001/health pour vérifier.

## Vérifier sans navigateur

```bash
cd /Users/marcabel/WarAide
npm run verify
```

16 tests automatiques (gares, liaisons, itinéraire, auth, Dijkstra).

## Commandes séparées

Backend seul :

```bash
cd /Users/marcabel/WarAide
npm run dev:backend
```

Frontend seul (dans un 2e terminal) :

```bash
cd /Users/marcabel/WarAide
npm run dev:frontend
```

## Erreurs fréquentes

| Erreur | Cause | Solution |
|--------|-------|----------|
| `cd: no such file or directory: waraide-app` | Vous êtes dans `backend/` | `cd ..` puis `npm run dev` |
| `EADDRINUSE :::3001` | Backend déjà lancé | `npm run stop` ou utilisez l'API existante |
| `zsh: command not found: #` | Commentaire collé dans le terminal | Ne copiez que les lignes de commande |
