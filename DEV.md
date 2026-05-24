# Développement local

Tout se teste sur votre machine avant déploiement Hostinger + Vercel.

## Prérequis

- XAMPP : **Apache** + **MySQL** démarrés
- Node.js (pour `npm run dev`)

## 1. Base de données (une fois)

Ouvrir dans le navigateur :

```
http://localhost/donchaminade-développeur-web/install.php
```

Puis créer `install.php.lock` (fait automatiquement) — `install.php` reste bloqué.

Resynchroniser toutes les données (catalogues → BDD) :

```bash
php database/apply-all-seeds.php
```

Migrations SQL en attente uniquement :

```bash
php database/apply-pending-migrations.php
```

## 2. Lancer le front React

```bash
npm install
npm run dev
```

| Service | URL |
|---------|-----|
| **Portfolio + Blog** | http://localhost:3000 |
| **Blog** | http://localhost:3000/blog |
| **Admin** | http://localhost/donchaminade-développeur-web/admin/login.php |

**Admin** : `chaminade.dondah.adjolou@gmail.com` (mot de passe défini dans `database/seed.php`)

## 3. Comment ça communique

```
┌─────────────────┐     proxy Vite      ┌──────────────────────────┐
│ localhost:3000  │ ──────────────────► │ localhost/.../api/*.php    │
│  (React)        │                     │  (XAMPP PHP + MySQL)       │
└─────────────────┘                     └──────────────────────────┘
        │                                          │
        │  /uploads/*                              │  admin/
        └──────── depuis public/uploads ◄──────────┘
```

- `VITE_API_URL` est **vide** en local : Vite redirige `/api` vers XAMPP (pas de souci CORS).
- **« Voir le site »** dans l’admin ouvre `http://localhost:3000`.
- Images / PDF téléversés → `public/uploads/` (visibles sur le port 3000 et via l’API).

## 4. Tester le flux complet

1. Admin → Blog → nouvel article (éditeur visuel + image)
2. Publier l’article
3. http://localhost:3000/blog → voir l’article
4. Like, commentaire, partage
5. Admin → Commentaires → approuver

## 5. Quand tout est OK → production

Voir **`DEPLOY.md`** :

- **Hostinger** : API PHP + MySQL + Admin
- **Vercel** : front React (`npm run build`)
- Copier **`.env.production.example`** vers la config Hostinger + variables Vercel
