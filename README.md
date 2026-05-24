# Donchaminade — Portfolio Développeur Web & Mobile

Portfolio professionnel full-stack : interface **React + Vite + TypeScript** (hébergée sur **Vercel**) et API / back-office **PHP + MySQL** (hébergés sur **Hostinger**).

| Environnement | URL |
|---------------|-----|
| **Site public (front)** | [https://donchaminade-alpha.vercel.app](https://donchaminade-alpha.vercel.app) |
| **API & médias** | [https://donchamfolio.grosbit.com](https://donchamfolio.grosbit.com) |
| **Administration** | [https://donchamfolio.grosbit.com/admin/login.php](https://donchamfolio.grosbit.com/admin/login.php) |

> Depuis Vercel, `/admin` redirige automatiquement vers la page de connexion Hostinger (voir [Configuration Vercel](#configuration-vercel)).

---

## Table des matières

- [Aperçu](#aperçu)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation locale](#installation-locale)
- [Variables d'environnement](#variables-denvironnement)
- [Scripts disponibles](#scripts-disponibles)
- [Structure du projet](#structure-du-projet)
- [Pages du site (front)](#pages-du-site-front)
- [API REST](#api-rest)
- [Espace administration](#espace-administration)
- [Base de données](#base-de-données)
- [Déploiement](#déploiement)
- [Sécurité](#sécurité)
- [Licence](#licence)
- [Auteur](#auteur)

---

## Aperçu

Ce dépôt regroupe :

- **Front** : SPA React (sections portfolio, blog, mode clair/sombre, animations Framer Motion).
- **Back-end** : API JSON en PHP, formulaire de contact, blog avec commentaires, uploads, notifications push Web (admin).
- **Admin** : panneau PHP pour gérer le contenu sans toucher au code.

Les données affichées sur le site proviennent de la base MySQL via l’API. Des constantes TypeScript (`constants.tsx`) servent de **fallback** si l’API est indisponible en développement.

---

## Architecture

```
┌─────────────────────────────┐         HTTPS          ┌──────────────────────────────┐
│  Vercel (React / Vite)      │  ──── VITE_API_URL ──►  │  Hostinger (PHP + MySQL)       │
│  donchaminade-alpha…        │                         │  donchamfolio.grosbit.com      │
│  • Pages publiques /blog    │                         │  • /api/*                      │
│  • Redirect /admin → Host.  │                         │  • /admin/*                    │
└─────────────────────────────┘                         └──────────────────────────────┘
```

---

## Prérequis

| Outil | Version conseillée |
|-------|-------------------|
| **Node.js** | 20+ (Vercel : 24.x) |
| **npm** | 10+ |
| **PHP** | 8.2+ |
| **Composer** | 2.x |
| **MySQL / MariaDB** | 8+ |
| **XAMPP** (optionnel) | Pour Apache + MySQL en local |

Extensions PHP utiles : `pdo_mysql`, `mbstring`, `json`, `openssl`, `curl`.

---

## Installation locale

### 1. Cloner et installer les dépendances front

```bash
git clone <url-du-repo>
cd donchaminade-développeur-web
npm install
```

### 2. Configurer l’environnement

```bash
cp .env.example .env
```

Renseigner la base de données et les URLs (voir [Variables d'environnement](#variables-denvironnement)).

### 3. Back-end PHP

```bash
composer install
```

Créer la base, puis lancer l’installation :

- Ouvrir `http://localhost/donchaminade-développeur-web/install.php`  
  **ou** importer `database/schema.sql` puis exécuter les seeds.

```bash
php database/apply-all-seeds.php
```

> Après installation en production, **supprimer** `install.php` sur le serveur et conserver `install.php.lock` si présent.

### 4. Lancer le front

```bash
npm run dev
```

Le front tourne en général sur `http://localhost:5173`. En local, `VITE_API_URL` peut rester vide : le proxy Vite pointe vers l’API PHP locale.

---

## Variables d'environnement

Fichiers modèles :

| Fichier | Usage |
|---------|--------|
| `.env.example` | Développement local |
| `.env.production.example` | Référence prod (Hostinger + Vercel) |

### Back-end (`.env` à la racine PHP)

| Variable | Description |
|----------|-------------|
| `APP_ENV` | `local` ou `production` |
| `APP_DEBUG` | `true` / `false` — **toujours `false` en prod** |
| `APP_URL` | URL publique de l’API (ex. `https://donchamfolio.grosbit.com`) |
| `FRONTEND_URL` | URL du front Vercel (CORS, liens) |
| `DB_*` | Connexion MySQL |
| `CORS_ORIGINS` | Origines autorisées (URL Vercel, séparées par des virgules) |
| `SESSION_NAME` | Nom de session admin |
| `VAPID_*` | Clés pour notifications push admin (**requis** pour alertes téléphone) |

### Front (Vercel)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL de l’API Hostinger, ex. `https://donchamfolio.grosbit.com` |

Ne jamais committer `.env` (déjà dans `.gitignore`).

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement Vite |
| `npm run build` | Build de production → dossier `dist/` |
| `npm run preview` | Prévisualisation du build |
| `npm run pack:hostinger` | Génère `hostinger-upload/` (+ zip) pour déploiement Hostinger |

Scripts PHP utiles :

| Script | Description |
|--------|-------------|
| `php database/apply-all-seeds.php` | Recharge tout le contenu catalogue en BDD |
| `php database/apply-pending-migrations.php` | Applique les migrations SQL en attente |
| `php database/generate-vapid-keys.php` | Génère les clés VAPID (push) |

---

## Structure du projet

```
├── admin/              # Back-office PHP (session, CRUD contenu)
├── api/                # Endpoints REST (portfolio, blog, contact…)
├── blog/               # Partage public d’articles (share.php)
├── components/         # Composants React
├── pages/              # BlogList, BlogPostPage
├── database/           # schema.sql, migrations/, catalog/, seeds
├── includes/           # Auth, Database, repositories…
├── public/             # Assets statiques (images portfolio)
├── scripts/            # build-hostinger-package.php
├── App.tsx             # Page d’accueil (sections)
├── vercel.json         # Build + redirects + SPA
└── vite.config.ts
```

Dossiers ignorés par Git : `node_modules/`, `dist/`, `vendor/`, `.env`, `hostinger-upload/`, `hostinger-upload.zip`, `public/uploads/*`.

---

## Pages du site (front)

Application **SPA** : une seule entrée HTML, routage côté client.

| Route | Contenu |
|-------|---------|
| `/` | Accueil — Hero, stats, à propos, projets, expériences, témoignages, communautés, clients, contact |
| `/blog` | Liste des articles (pagination, filtres par catégorie) |
| `/blog/:slug` | Article détaillé (sommaire, likes, partage, commentaires) |

### Sections de la page d’accueil (ancres)

| Ancre | Section |
|-------|---------|
| `#apropos` | Profil |
| `#experience` | Parcours professionnel |
| `#projets` | Projets mis en avant |
| `#testimonials` | Témoignages & recommandations |
| `#communaute` | Communautés & événements |

### Redirection admin (Vercel)

| Route Vercel | Comportement |
|--------------|--------------|
| `/admin` | → `https://donchamfolio.grosbit.com/admin/login.php` |
| `/admin/*` | → même chemin sur Hostinger |

Configuration dans `vercel.json` (`redirects`).

---

## API REST

Base : `{APP_URL}/api/`

### Portfolio (`/api/index.php`)

Paramètre `?resource=` :

| Ressource | Données |
|-----------|---------|
| `portfolio` | Bundle complet |
| `profile` | Profil |
| `stats` | Statistiques |
| `experiences` | Expériences |
| `projects` | Tous les projets |
| `projects-featured` | Projets mis en avant |
| `skills` | Compétences techniques + soft skills |
| `education` | Formation |
| `awards` | Distinctions |
| `communities` | Communautés |
| `testimonials` | Témoignages |
| `recommendations` | Recommandations LinkedIn |
| `managed-pages` | Pages gérées (ex. CV) |
| `gallery` | Galerie photos |
| `clients` | Logos clients |
| `technologies` | Stack technique |

### Autres endpoints

| Fichier | Rôle |
|---------|------|
| `api/blog.php` | Liste, détail, catégories, likes, partages, commentaires |
| `api/contact.php` | Formulaire de contact (+ pièces jointes) |
| `api/testimonials.php` | Soumission publique de témoignages |
| `api/recommendations.php` | Soumission de recommandations |

Réponses au format JSON `{ "success": true, "data": … }`.

---

## Espace administration

URL : **https://donchamfolio.grosbit.com/admin/login.php**

Authentification par **session PHP** (email + mot de passe hashé en BDD).

| Module | Fichier | Gestion |
|--------|---------|---------|
| Tableau de bord | `index.php` | Vue d’ensemble |
| Profil | `profile.php` | Identité, photo, liens |
| Statistiques | `stats.php` | Chiffres clés |
| Technologies | `technologies.php` | Stack |
| Expériences | `experiences.php` | Parcours |
| Projets | `projects.php` | Portfolio projets |
| Compétences | `skills.php` | Blocs skills + soft skills |
| Distinctions | `awards.php` | Prix / certifications |
| Témoignages | `testimonials.php` | Modération |
| Recommandations | `recommendations.php` | Modération |
| Communautés | `communities.php` | Événements & communautés |
| Blog | `blog.php` | Articles (éditeur Quill) |
| Commentaires blog | `blog-comments.php` | Modération |
| Messages | `messages.php` | Contact reçu |
| Notifications | `notifications.php` | Alertes admin |
| Push | `push-config.php` | Configuration Web Push |
| Journaux | `audit-logs.php` | Historique d’actions |

---

## Base de données

- Schéma initial : `database/schema.sql`
- Migrations incrémentales : `database/migrations/*.sql`
- Données de référence : `database/catalog/*.php`
- Seed global : `php database/apply-all-seeds.php`

Tables principales : profil, projets, expériences, blog, commentaires, contact, témoignages, recommandations, communautés, clients, galerie, technologies, admin, push subscriptions, audit logs.

---

## Déploiement

### Front — Vercel

1. Connecter le dépôt GitHub à Vercel.
2. Framework : **Vite** (détecté via `vercel.json`).
3. Variable d’environnement :  
   `VITE_API_URL=https://donchamfolio.grosbit.com`
4. Branche de production : `master` (ou `main`).
5. Chaque push déclenche un build (`npm run build` → `dist/`).

### Back-end — Hostinger

1. Générer le package :

   ```bash
   npm run pack:hostinger
   ```

2. Uploader le contenu de `hostinger-upload/` (ou `hostinger-upload.zip`) vers :  
   `public_html/donchamfolio/`

3. Créer `.env` sur le serveur (voir `.env.production.example`).

4. Importer la base via phpMyAdmin ou lancer `install.php` **une seule fois**, puis le supprimer.

5. Vérifier :
   - `https://donchamfolio.grosbit.com/api/index.php?resource=portfolio`
   - `https://donchamfolio.grosbit.com/admin/login.php`

### Notifications push (admin PWA)

1. Générer les clés : `npx web-push generate-vapid-keys`
2. Les coller dans le `.env` Hostinger (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`)
3. Sur le téléphone : ouvrir l’app admin installée → cloche → **Activer les notifications push**
4. Tester avec **Envoyer un test** (dans le panneau cloche)

Alertes automatiques : nouveau message contact, commentaire blog, témoignage ou recommandation en attente.

### Checklist post-déploiement

- [ ] `APP_DEBUG=false` sur Hostinger  
- [ ] Clés `VAPID_*` dans `.env` Hostinger  
- [ ] `CORS_ORIGINS` contient l’URL Vercel exacte  
- [ ] `VITE_API_URL` configuré sur Vercel + redeploy  
- [ ] `install.php` supprimé en production  
- [ ] Mot de passe admin fort  
- [ ] Dossier `uploads/` accessible en écriture (755/775)

---

## Sécurité

- Ne pas exposer `.env`, clés VAPID privées, ni mots de passe dans le dépôt.
- CSRF sur les formulaires admin.
- Uploads filtrés (`FileUploader`).
- En production : HTTPS obligatoire, sessions sécurisées, `APP_DEBUG=false`.
- Modération des témoignages, recommandations et commentaires blog avant publication.

Signaler une faille : [chaminade.dondah.adjolou@gmail.com](mailto:chaminade.dondah.adjolou@gmail.com).

---

## Licence

Ce projet est distribué sous licence **MIT** — voir le fichier [LICENSE](LICENSE).

Les dépendances tierces (npm, Composer) restent soumises à leurs propres licences (`node_modules/`, `vendor/`).

---

## Auteur

**ADJOLOU Dondah Chaminade** — Développeur Web & Mobile  

- Site : [donchaminade-alpha.vercel.app](https://donchaminade-alpha.vercel.app)  
- LinkedIn : [linkedin.com/in/chaminadeadjolou](https://linkedin.com/in/chaminadeadjolou)  
- GitHub : [github.com/Donchaminade](https://github.com/Donchaminade)  
- X : [@Donchaminde](https://x.com/Donchaminde)  
- Email : [chaminade.dondah.adjolou@gmail.com](mailto:chaminade.dondah.adjolou@gmail.com)

---

*Dernière mise à jour : mai 2026*
