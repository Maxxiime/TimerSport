# TimerSport

Application React + Vite pour des entraînements chronométrés.

## Prérequis

- **Node.js 20+** (recommandé: Node 20 LTS)
- npm 10+

Ce projet dépend de paquets (`workbox-build`, `glob@11`, etc.) qui demandent Node 20 minimum.
Avec Node 18, `npm` affiche des warnings `EBADENGINE`.

## Installation

```bash
npm ci
```

## Lancement en développement

```bash
npm run dev -- --host 0.0.0.0 --port 4000
```

## Build de production

```bash
npm run build
```

## Dépannage

### Erreur console `content.js ... reading 'runtime'`

Si l'erreur vient d'un fichier nommé `content.js` (sans chemin de votre projet), elle provient en général d'une **extension navigateur** injectée dans la page (pas de l'application TimerSport).

Vérifications rapides:

1. Ouvrir l'app en navigation privée **sans extensions**.
2. Désactiver temporairement les extensions (adblock, wallet, traducteur, etc.).
3. Tester dans un autre navigateur propre.

Si l'erreur disparaît, le code de l'application n'est pas en cause.
