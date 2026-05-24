# Déploiement production (après tests locaux)

Ne déployer qu’une fois le parcours validé en local (`DEV.md`).

## Architecture cible

| Composant | Hébergement | URL exemple |
|-----------|-------------|-------------|
| Front React | **Vercel** | https://donchaminade-alpha.vercel.app |
| API + Admin + MySQL | **Hostinger** | https://donchamfolio.grosbit.com |
| Médias uploadés | **Hostinger** (`public/uploads/`) | servis par l’API |

## Phase 1 — Hostinger (API + admin)

1. Uploader tout le projet PHP (sans `node_modules/`, sans `dist/`).
2. Créer la base MySQL dans hPanel, importer `database/schema.sql` **ou** lancer `install.php` **une fois** puis le supprimer.
3. Si la base existe déjà sans données : en SSH ou cron, exécuter une fois :
   ```bash
   php database/apply-all-seeds.php
   ```
   (Migrations en attente : `php database/apply-pending-migrations.php`)
4. Fichier `.env` sur le serveur (modèle : `.env.production.example`) :

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://donchamfolio.grosbit.com
FRONTEND_URL=https://donchaminade-alpha.vercel.app
CORS_ORIGINS=https://donchaminade-alpha.vercel.app
DB_HOST=...
DB_NAME=...
DB_USER=...
DB_PASS=...
```

5. Droits en écriture sur `public/uploads/`.
6. HTTPS activé.
7. Changer le mot de passe admin.
8. Admin accessible : `https://donchamfolio.grosbit.com/admin/login.php`

## Phase 2 — Vercel (front)

1. Repo connecté à Vercel, build : `npm run build`, output : `dist`.
2. Variable d’environnement :

```env
VITE_API_URL=https://donchamfolio.grosbit.com
```

3. Redéployer.

## Phase 3 — Vérifications

- [ ] https://donchaminade-alpha.vercel.app — portfolio OK
- [ ] /blog — articles depuis l’API Hostinger
- [ ] Images uploadées visibles (URLs via `VITE_API_URL`)
- [ ] Admin sur Hostinger : création article → visible sur Vercel sous 1 min
- [ ] `install.php` supprimé sur Hostinger
- [ ] CORS : pas d’erreur dans la console navigateur (F12)

## Retour en développement local

Remettre dans `.env` les valeurs de `DEV.md` (`FRONTEND_URL=http://localhost:3000`, `VITE_API_URL=` vide).
