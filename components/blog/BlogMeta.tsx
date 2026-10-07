import { useEffect, type FC } from 'react';
import { BlogPostDetail } from '../../lib/api';
import { toPublishedIso, TWITTER_HANDLE } from '../../lib/blogOg';
import { mediaUrl } from '../../lib/media';
import { getCanonicalShareUrl, getSharePreviewImageUrl } from '../../lib/ogImage';

interface Props {
  post: BlogPostDetail;
  noIndex?: boolean;
}

/** Balises meta dynamiques (complète la page share.php pour les crawlers). */
const BlogMeta: FC<Props> = ({ post, noIndex = false }) => {
  useEffect(() => {
    const title = `${post.title} — Donchaminade`;
    const description = post.excerpt || '';
    const cover = mediaUrl(post.cover_image);
    const image = /^https?:\/\//i.test(cover) ? cover : getSharePreviewImageUrl();
    const url = getCanonicalShareUrl(window.location.href);

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

    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMeta('name', 'description', description);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:title', post.title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:site', TWITTER_HANDLE);
    setMeta('name', 'twitter:creator', TWITTER_HANDLE);
    setMeta('name', 'twitter:title', post.title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    const published = toPublishedIso(post.published_at);
    if (published) setMeta('property', 'article:published_time', published);
  }, [post, noIndex]);

  return null;
};

export default BlogMeta;
