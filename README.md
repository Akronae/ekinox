# 💽 EkinoxTV

---

## 🧱 Stack technique

| Brique            | Choix                          |
| ----------------- | ------------------------------ |
| Langage           | **TypeScript 6**               |
| Runtime           | **Node.js** (≥ 22)             |
| Frontend          | **React 19**                   |
| Bundler           | **Vite 8**                     |
| UI                | **Mantine v9**                 |
| Tests             | **Vitest 5**                   |
| Linting           | **Oxlint**                     |
| Package manager   | **Yarn**                       |
| Compilation React | **React Compiler** (via Babel) |

---

## 🚀 Démarrer le projet

### Prérequis

- **Node.js** ≥ 22
- **Yarn** (ou `corepack enable` pour utiliser celui fourni par Node)

### Installation

```bash
yarn install
```

### Lancer en développement

```bash
yarn dev
```

L'application est accessible sur [http://localhost:5173](http://localhost:5173).

### Build de production

```bash
yarn build
```

Le résultat est généré dans le dossier `dist/`.

### Prévisualiser le build

```bash
yarn preview
```

---

## 🧪 Tests

```bash
yarn test
```

Les tests unitaires couvrent la logique métier (`src/business/getBill.test.ts`) :

- Calcul du prix avec 1, 2 ou 3 volets distincts
- Gestion des doublons (même volet acheté plusieurs fois)
- Mélange DVDs _Back to the Future_ + autres films
- Normalisation des entrées (casse, espaces, lignes vides)
- Structure de sortie de la facture

---

## 🧹 Linting

```bash
yarn lint
```

---

## 📁 Structure du projet

```
ekinox/
├── index.html                  # Point d'entrée HTML
├── package.json                # Dépendances et scripts
├── vite.config.ts              # Configuration Vite
├── vitest.config.ts            # Configuration Vitest
├── tsconfig.json               # Références TypeScript
├── tsconfig.app.json           # Configuration TS pour l'app
├── tsconfig.node.json          # Configuration TS pour Vite
├── postcss.config.cjs          # PostCSS + preset Mantine
├── .oxlintrc.json              # Règles Oxlint
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                # Point d'entrée React
    ├── App.tsx                 # Composant racine
    ├── index.css               # Styles globaux
    ├── theme.tsx               # Thème Mantine personnalisé
    ├── business/
    │   ├── getBill.ts          # Logique métier (calcul de facture)
    │   └── getBill.test.ts     # Tests unitaires
    ├── components/
    │   └── OrderArea.tsx       # Interface de saisie et affichage du panier
    └── utils/
        ├── formatCurrency.ts   # Formatage monétaire (€)
        └── nbhy.ts             # Utilitaire caractère spécial
```

### Séparation des responsabilités

- **`src/business/`** : logique métier **pure**, sans dépendance à React ou au DOM. Peut être testée unitairement sans navigateur.
- **`src/components/`** : interface utilisateur React avec Mantine.
- **`src/utils/`** : utilitaires de formatage.

---

## 🧠 Logique métier

La fonction `getBill(movies: string[])` dans `src/business/getBill.ts` prend un tableau de noms de films (un par ligne saisie dans l'UI) et retourne une facture structurée :

```typescript
{
  items:     { label, units, value }[],   // lignes article
  subTotal:  { label, value },            // sous-total
  discounts: { label, value }[],          // remises éventuelles
  total:     { label, value }             // total à payer
}
```

### Règles de normalisation

- Les noms de films sont nettoyés : **espaces multiples réduits**, **casse minuscule**, **bords trimmés**.
- Les lignes vides ou blanches sont ignorées.
- Un film est identifié comme _Back to the Future_ si son nom normalisé commence par `"back to the future"`.

---

## 🖥️ Utilisation de l'application

1. Saisissez les noms de films dans la zone de texte, **un film par ligne**.
2. Le panier et le prix se mettent à jour en temps réel à droite.

Exemple de saisie :

```
Back to the Future 1
Back to the Future 2
Back to the Future 3
La chèvre
```

→ Sous-total : 65 €, remise 20 % sur les 3 volets BTtF : −9 €, **Total : 56 €**.

---

## 🚧 Ce qui serait amélioré dans une vraie application de production

- Créer un vrai moteur de facturation/promotion avec des régles composables.
- Définir les films et leurs prix dans une **source de données externe** plutôt que de les coder en dur dans `getBill.ts`.
- Ne pas inférer la saga à partir du nom d'un film.
- Ajouter une **limite au nombre de lignes** pour éviter les dénis de service (ex. 10 000 lignes max).
- Logger les cas limites côté métier pour faciliter le debugging et le monitoring.
- Externaliser tous les textes affichés (labels, messages, format monétaire) avec une lib comme `react-intl` ou `i18next`.
- Permettre le choix de la devise (actuellement codé en EUR dans `formatCurrency`).
- Ajouter des **tests de composants React** (via Testing Library) pour vérifier le rendu de `OrderArea` et les interactions utilisateur.
- Mettre en place des **tests end-to-end** (Playwright ou Cypress) pour valider le parcours complet de saisie → affichage du prix.
- Intégrer les tests dans une **CI** (GitHub Actions / GitLab CI) avec exécution automatique à chaque PR.
- Ajouter des **tests de performance** pour s'assurer que `getBill` reste rapide sur de gros volumes (ex. 10k lignes).
- Sauvegarder le panier dans le **stockage local** (`localStorage`) pour ne pas perdre la saisie au rechargement de la page.

---

## 👤 Auteur

Alexandre — Exercice technique pour le processus de recrutement Ekinox, septembre 2026.
