# Backend PHP — Portfolio Donchaminade

## Prérequis

- XAMPP (Apache + MySQL + PHP 8.1+)
- Extension PHP `pdo_mysql`

## Installation

1. Copier `.env.example` en `.env` et ajuster `DB_*` et `APP_URL`.
2. Démarrer Apache et MySQL dans XAMPP.
3. Ouvrir dans le navigateur :  
   `http://localhost/donchaminade-développeur-web/install.php`
4. Se connecter à l’admin :  
   `http://localhost/donchaminade-développeur-web/admin/login.php`

**Identifiants par défaut (à changer immédiatement)**

- Email : `chaminade.dondah.adjolou@gmail.com`
- Mot de passe : hashé dans `database/seed.php` (ne jamais committer le mot de passe en clair)

5. En production, **supprimer `install.php`**.

## API publique (lecture seule)

| Endpoint | Description |
|----------|-------------|
| `GET /api/index.php?resource=portfolio` | Toutes les données |
| `GET /api/index.php?resource=projects` | Projets |
| `GET /api/index.php?resource=experiences` | Expériences |
| `GET /api/index.php?resource=profile` | Profil |
| `POST /api/contact.php` | Enregistrer un message (JSON) |

## Admin

- Projets, expériences, profil, stats, témoignages, messages
- Compétences (blocs imbriqués) : prochaine itération — saisie manuelle SQL ou extension admin

## Blog

| Endpoint | Description |
|----------|-------------|
| `GET /api/blog.php?action=list` | Liste des articles publiés |
| `GET /api/blog.php?action=post&slug=xxx` | Détail + commentaires approuvés |
| `POST /api/blog.php` `{action:'like', slug}` | Like / unlike |
| `POST /api/blog.php` `{action:'share', slug, platform}` | Compteur partages |
| `POST /api/blog.php` `{action:'comment', slug, name, content}` | Nouveau commentaire (modération) |

**Admin** : `admin/blog.php`, `admin/blog-comments.php`

### Rédaction & médias

- **Éditeur visuel** (Quill) : vous écrivez comme dans Word, sans balises HTML
- **Téléversement** : images (blog, projets, profil), CV PDF → `public/uploads/`
- Les fichiers sont servis par le serveur PHP ; sur Vercel, `VITE_API_URL` doit pointer vers ce serveur

## Front React + Vercel

Variable `VITE_API_URL` dans `.env` (local) et sur Vercel. Voir `DEPLOY.md`.

Routes : `/blog`, `/blog/{slug}`

## Agent Skills (Cursor global)

23 skills installés dans `%USERPROFILE%\.cursor\skills\` — actifs sur **tous** vos projets Cursor.
