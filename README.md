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
- [Chatbot portfolio (gratuit)](#chatbot-portfolio-gratuit)
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
- **Back-end** : API JSON en PHP, formulaire de contact, blog avec commentaires, uploads, notifications **email** + push Web (admin).
- **Admin** : panneau PHP pour gérer le contenu sans toucher au code.

Les données affichées sur le site proviennent de la base MySQL via l’API. Des constantes TypeScript (`constants.tsx`) servent de **fallback** si l’API est indisponible en développement.

---

## Architecture

```
┌─────────────────────────────┐         HTTPS          ┌──────────────────────────────┐
│  Vercel (React / Vite)      │  ──── VITE_API_URL ──►  │  Hostinger (PHP + MySQL)       │
│  donchaminade-alpha…        │                         │  donchamfolio.grosbit.com      │
│  • Pages publiques /blog    │                         │  • /api/*                      │
│  • POST /api/chat (LLM)     │  ── retrieval public ─► │  • /admin/*                    │
│  • Redirect /admin → Host.  │                         │                                │
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
| `NOTIFY_EMAIL` | Destinataire des alertes email (prioritaire). Sinon `ADMIN_EMAIL`, puis email du profil |
| `NOTIFY_EMAIL_ENABLED` | `true` par défaut dès qu’un transport SMTP ou `mail()` est disponible |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` | Serveur SMTP Hostinger (`smtp.hostinger.com`, `465`/`ssl` ou `587`/`tls`) |
| `SMTP_USER` / `SMTP_PASS` | Identifiants SMTP (jamais en dur dans le code) |
| `SMTP_FROM` / `SMTP_FROM_NAME` | Expéditeur. Par défaut : `SMTP_USER` |
| `MAIL_FALLBACK` | `true` : si SMTP n’est pas configuré, utilise PHP `mail()` (moins fiable) |

### Front (Vercel)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL de l’API Hostinger, ex. `https://donchamfolio.grosbit.com` |
| `PORTFOLIO_API_URL` | Base API pour le retrieval du chatbot (serveur). Défaut : `https://donchamfolio.grosbit.com` |
| `GROQ_API_KEY` | Clé **gratuite** Groq (Llama). [console.groq.com](https://console.groq.com) — prioritaire |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Clé **gratuite** Gemini. [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `GEMINI_API_KEY` | Alias accepté pour Gemini (non exposé au navigateur) |
| `GROQ_MODEL` | Optionnel. Défaut : `openai/gpt-oss-20b` |
| `GOOGLE_GENERATIVE_AI_MODEL` | Optionnel. Défaut : `gemini-2.5-flash` |
| `CHAT_RATE_LIMIT_PER_MIN` | Optionnel. Défaut : `12` |

Sans `GROQ_API_KEY` ni clé Gemini, le widget **continue de répondre** à partir des faits publics (mode fallback). Ne jamais committer `.env` (déjà dans `.gitignore`). Ne pas préfixer les clés LLM par `VITE_` — elles resteraient visibles dans le bundle.

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
| `php scripts/test-notify-email.php` | Envoie un email de test (ou `--dry-run`) |

---

## Structure du projet

```
├── admin/              # Back-office PHP (session, CRUD contenu)
├── api/                # Endpoints REST PHP + api/chat.js (bundle Vercel)
├── blog/               # Partage public d’articles (share.php)
├── components/         # Composants React (dont PortfolioChat)
├── lib/chat/           # Retrieval, fallback, rate-limit, handler LLM
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

Widget **Assistant** (bas gauche) : questions sur le contenu public du portfolio, toutes pages.

---

## Chatbot portfolio (gratuit)

Assistant flottant (mobile-first) qui ne répond **qu’à propos de Donchaminade** : bio, projets, expériences (dont Coach 48h Hackathon YAS Togo & Next Gen, bénévole speakers PyCon Togo 2026), blogs, compétences, témoignages, contact public.

### Comment ça marche

1. **Retrieval** — la route Vercel `POST /api/chat` interroge les APIs publiques Hostinger (`/api/index.php?resource=portfolio`, `/api/blog.php?action=list`) avec un cache court (~5 min), fusionne le catalogue local (`lib/chat/catalog.ts`) et les faits CV/LinkedIn (`lib/chat/knowledge.ts`). L’API portfolio prime pour les projets affichés et le poste actuel GROSBIT SARLU (fév. 2026 – présent).
2. **LLM gratuit (optionnel)** — [Vercel AI SDK](https://ai-sdk.dev) + `@ai-sdk/groq` (GPT-OSS 20B) ou `@ai-sdk/google` (Gemini 2.5 Flash). Streaming UI.
3. **Fallback** — si aucune clé n’est définie ou si le provider échoue : réponses modèle/recherche à partir des faits déjà récupérés. Jamais de crash.

Les conversations ne sont **pas stockées** (état éphémère du navigateur). Un bandeau précise que les réponses viennent du contenu public.

### Variables à coller sur Vercel (projet `donchaminade`)

Production + Preview :

| Nom | Obligatoire | Valeur |
|-----|-------------|--------|
| `VITE_API_URL` | déjà en place | `https://donchamfolio.grosbit.com` |
| `PORTFOLIO_API_URL` | recommandé | `https://donchamfolio.grosbit.com` |
| `GROQ_API_KEY` **ou** `GOOGLE_GENERATIVE_AI_API_KEY` | pour le LLM | clé gratuite uniquement |

Redeploy après ajout d’une clé. Le preview Git fonctionne sans clé (fallback).

Local : ajouter la même clé dans `.env` (voir `.env.example`), puis `npm run dev`.

Test retrieval / fallback : `npm run test:chat`.

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

Pour provisionner un compte (APP BUILDER PRO / propriétaire) **sans commiter de secret** :

1. Sur Hostinger, dans le `.env` de `donchamfolio/` :
   - `ADMIN_EMAIL=...`
   - `ADMIN_PASSWORD=` (12 caractères minimum)
   - `ADMIN_NAME=Administrateur` (optionnel)
2. Ouvrir `/admin/login.php` : le compte est créé ou mis à jour à la connexion.
3. Ne jamais coller ce mot de passe dans Git.

### Workflow blog (obligatoire)

1. **Enregistrer le brouillon** — l’article n’apparaît pas sur le portfolio.
2. **Prévisualiser** — lien `/blog/preview/{jeton}` (rendu public, `noindex`, hors liste).
3. **Valider et publier** — seule action qui met l’article en ligne.
4. **Kit de partage** — textes Facebook et X + liens d’intent, prêts à coller. Les connecteurs sociaux pourront poster plus tard.

Un article de démonstration reste en brouillon : *« Agents IA en 2026 : écrire plus vite, publier seulement après validation »*.

Resync catalogues / migrations (après deploy) : `GET /api/catalog-sync.php` avec session admin ou en-tête `X-Catalog-Sync-Token`.

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
| Blog | `blog.php` | Brouillons, aperçu public, validation puis publication + kit Facebook/X |
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
3. Variables d’environnement :  
   `VITE_API_URL=https://donchamfolio.grosbit.com`  
   Optionnel chatbot : `GROQ_API_KEY` **ou** `GOOGLE_GENERATIVE_AI_API_KEY` + `PORTFOLIO_API_URL`
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

Alertes automatiques (push **et email**) : nouveau message contact, demande Collaborons, commentaire blog, témoignage à valider, nouvelle recommandation.

### Notifications email (admin)

Les emails sont envoyés **en français**, HTML + texte, avec un lien vers l’admin. L’API publique **réussit même si l’email échoue** (erreur journalisée).

**Destinataire** (dans cet ordre) : `NOTIFY_EMAIL` → `ADMIN_EMAIL` → premier `users.email` → `site_profile.email`.

**Transport recommandé (Hostinger)** : SMTP du compte mail hPanel.

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=ssl
SMTP_USER=votre@domaine.com
SMTP_PASS=********
SMTP_FROM=votre@domaine.com
NOTIFY_EMAIL=votre@domaine.com
NOTIFY_EMAIL_ENABLED=true
```

**Fallback** : si `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` sont vides et `MAIL_FALLBACK=true`, PHP `mail()` est utilisé. Sur Hostinger c’est souvent moins fiable (spam, pas d’auth) — préférez SMTP.

**Test sur le serveur** (après avoir mis à jour le `.env` et **redéployé** le code PHP) :

1. Appliquer la migration : `php database/apply-pending-migrations.php`
2. `php scripts/test-notify-email.php` **ou** cloche admin → **Tester l’email**
3. Envoyer un message depuis https://donchaminade-alpha.vercel.app (contact / Collaborons)

> Le site Hostinger **ne suit pas Git automatiquement**. Tant que vous n’avez pas uploadé / extraire le package (`npm run pack:hostinger`) ou synchronisé `donchamfolio/`, le live reste sur l’ancienne version.

`NOTIFY_EMAIL_DRY_RUN=true` journalise sans envoyer (utile en local).

### Checklist post-déploiement

- [ ] `APP_DEBUG=false` sur Hostinger  
- [ ] Clés `VAPID_*` dans `.env` Hostinger  
- [ ] SMTP / `NOTIFY_EMAIL` configurés si les alertes email sont voulues  
- [ ] `SMTP_*` + `NOTIFY_EMAIL` dans `.env` Hostinger, puis test email  
- [ ] `CORS_ORIGINS` contient l’URL Vercel exacte  
- [ ] `VITE_API_URL` configuré sur Vercel + redeploy  
- [ ] (Chatbot IA) `GROQ_API_KEY` ou `GOOGLE_GENERATIVE_AI_API_KEY` sur le projet Vercel `donchaminade`  
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
