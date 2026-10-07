import React, { useEffect, useMemo, useState } from 'react';
import { BlogCategoryApi, BlogPostSummary, fetchBlogList } from '../lib/api';
import { getBlogCategory, setBlogCategoriesRegistry } from '../lib/blogCategories';
import { mediaUrl } from '../lib/media';
import { navigate } from '../lib/navigation';
import { MobileNav, PageDecor, SiteFooter, SiteHeader } from '../components/layout/SiteChrome';

function pillClass(id: string): string {
  if (id.includes('sante')) return 'pill sante';
  if (id.includes('spir')) return 'pill spi';
  if (id.includes('moti')) return 'pill moti';
  return 'pill';
}

function patternClass(id: string): string {
  if (id.includes('sante')) return 'pattern p-wave';
  if (id.includes('spir')) return 'pattern p-ray';
  if (id.includes('moti')) return 'pattern p-tri';
  return 'pattern p-dot';
}

function formatDate(value: string): string {
  if (!value) return '';
  return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function openPost(event: React.MouseEvent<HTMLAnchorElement>, slug: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  navigate(`/blog/${slug}`);
}

const Cover: React.FC<{ post: BlogPostSummary; className?: string }> = ({ post, className }) => {
  const cat = getBlogCategory(post.category);
  if (post.cover_image) {
    return <img className={className} src={mediaUrl(post.cover_image)} alt="" loading="lazy" />;
  }
  return <div className={patternClass(cat.id)} aria-hidden="true" />;
};

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [categories, setCategories] = useState<BlogCategoryApi[]>([]);
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchBlogList(1, undefined, 50)
      .then((res) => {
        if (cancelled) return;
        setPosts(res.data);
        setHasMore(res.hasMore);
        setPage(1);
        if (res.categories?.length) {
          setCategories(res.categories);
          setBlogCategoriesRegistry(res.categories.map((item) => ({ id: item.slug, label: item.label, emoji: item.emoji || '📝' })));
        }
      })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Erreur de chargement'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach((post) => map.set(post.category, (map.get(post.category) || 0) + 1));
    return map;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (category !== 'all' && post.category !== category) return false;
      if (!q) return true;
      return `${post.title} ${post.excerpt}`.toLowerCase().includes(q);
    });
  }, [posts, category, query]);

  const featured = category === 'all' && !query ? filtered[0] : undefined;
  const grid = featured ? filtered.slice(1) : filtered;

  const loadMore = async () => {
    const next = page + 1;
    const res = await fetchBlogList(next, undefined, 50);
    setPosts((current) => [...current, ...res.data]);
    setHasMore(res.hasMore);
    setPage(next);
  };

  return (
    <div className="page-pad">
      <a className="skip" href="#main">Aller au contenu</a>
      <PageDecor />
      <SiteHeader current="blog" />
      <main id="main">
        <section className="b-hero">
          <div className="dots" aria-hidden="true" />
          <div className="wrap">
            <div>
              <p className="kicker">Le blog</p>
              <h1>Idées, tech et <em>équilibre</em>, écrits depuis Lomé</h1>
              <p className="lead">Analyses longues en français sur le développement, les agents IA et le cloud, et des textes plus personnels sur l’énergie, la foi et l’engagement.</p>
              <label className="search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <span className="sr-only">Rechercher un article</span>
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un article…" />
              </label>
            </div>
            <svg className="illu" viewBox="0 0 440 360" role="img" aria-label="Illustration : carnet d’articles, code et idées">
              <circle cx="220" cy="180" r="150" fill="none" stroke="#7E9DC7" strokeOpacity=".45" strokeDasharray="4 8" />
              <g className="float">
                <rect x="120" y="70" width="190" height="230" rx="16" fill="#F4F7FB" transform="rotate(-6 215 185)" />
              </g>
              <g className="float2">
                <rect x="292" y="58" width="104" height="64" rx="14" fill="#0F2440" stroke="#7E9DC7" />
                <text x="344" y="99" textAnchor="middle" fontFamily="ui-monospace,monospace" fontSize="24" fontWeight="700" fill="#8BCBFF">&lt;/&gt;</text>
              </g>
              <g className="float">
                <circle cx="86" cy="118" r="26" fill="#F6C35B" />
              </g>
            </svg>
          </div>
        </section>
        <div className="band" aria-hidden="true" />
        <section className="section" style={{ paddingTop: 36 }}>
          <div className="wrap">
            <nav className="cats" aria-label="Catégories">
              <button type="button" className={category === 'all' ? 'on' : ''} onClick={() => setCategory('all')}>
                Tous <span className="n">{posts.length}</span>
              </button>
              {categories.map((item) => (
                <button key={item.slug} type="button" className={category === item.slug ? 'on' : ''} onClick={() => setCategory(item.slug)}>
                  {item.emoji} {item.label} <span className="n">{counts.get(item.slug) || 0}</span>
                </button>
              ))}
            </nav>

            {loading && <p className="muted">Chargement des articles…</p>}
            {error && <p role="alert">{error}</p>}

            {featured && (
              <a className="featured card" href={`/blog/${featured.slug}`} onClick={(event) => openPost(event, featured.slug)}>
                <div className="fmedia"><Cover post={featured} /></div>
                <div className="fbody">
                  <span className={pillClass(featured.category)}>{getBlogCategory(featured.category).emoji} {getBlogCategory(featured.category).label}</span>
                  <p className="kicker">À la une</p>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <div className="meta"><span>{formatDate(featured.published_at)}</span><span>{featured.reading_time} min de lecture</span></div>
                  <span className="readmore">Lire l’article →</span>
                </div>
              </a>
            )}

            <div className="section-head" style={{ marginTop: 44 }}>
              <div><p className="kicker">Derniers articles</p><h2 style={{ fontSize: 'var(--fs-xl)' }}>À lire ensuite</h2></div>
            </div>
            <div className="bgrid">
              {grid.map((post) => {
                const cat = getBlogCategory(post.category);
                return (
                  <a key={post.id} className="bcard card" href={`/blog/${post.slug}`} onClick={(event) => openPost(event, post.slug)}>
                    <div className="bmedia">
                      <Cover post={post} />
                      <span className={pillClass(post.category)}>{cat.emoji} {cat.label}</span>
                    </div>
                    <div className="bbody">
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="meta"><span>{formatDate(post.published_at)}</span><span>{post.reading_time} min</span></div>
                    </div>
                  </a>
                );
              })}
            </div>
            {!loading && filtered.length === 0 && <p className="muted">Aucun article ne correspond.</p>}
            {hasMore && category === 'all' && !query && (
              <div className="more"><button type="button" className="btn btn-secondary btn-lg" onClick={loadMore}>Charger plus d’articles</button></div>
            )}

            <div className="section-head" style={{ marginTop: 64 }}>
              <div><p className="kicker">Séries</p><h2 style={{ fontSize: 'var(--fs-xl)' }}>Explorer par thème</h2></div>
            </div>
            <div className="series">
              <button type="button" className="s1" onClick={() => { setCategory('all'); setQuery('agent'); }}><strong>Agents & IA</strong><span>Outils, harness, MCP</span></button>
              <button type="button" className="s2" onClick={() => { setCategory('all'); setQuery('cloud'); }}><strong>Cloud & DevOps</strong><span>Cloudflare, Docker, CI</span></button>
              <button type="button" className="s3" onClick={() => setCategory(categories.find((item) => /sante|spir/i.test(item.slug))?.slug || 'sante')}><strong>Équilibre & foi</strong><span>Lâcher prise, santé mentale</span></button>
              <button type="button" className="s4" onClick={() => { setCategory('all'); setQuery('bénévol'); }}><strong>Engagement</strong><span>Bénévolat, communautés</span></button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter year={String(new Date().getFullYear())} />
      <MobileNav current="blog" />
    </div>
  );
};

export default BlogList;
