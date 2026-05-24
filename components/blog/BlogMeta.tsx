import { useEffect } from 'react';
import { BlogPostDetail } from '../../lib/api';
import { getSharePreviewImageUrl } from '../../lib/ogImage';

interface Props {
  post: BlogPostDetail;
}

/** Balises meta dynamiques (complète la page share.php pour les crawlers). */
const BlogMeta: React.FC<Props> = ({ post }) => {
  useEffect(() => {
    const title = `${post.title} — Donchaminade`;
    const description = post.excerpt || '';
    const image = getSharePreviewImageUrl();
    const url = post.share_url || window.location.href;

    document.title = title;

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:title', post.title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', post.title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
  }, [post]);

  return null;
};

export default BlogMeta;
