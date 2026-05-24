import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Share2,
  Linkedin,
  Twitter,
  Link2,
  Facebook,
  Mail,
  MessageCircle,
} from 'lucide-react';
import {
  SHARE_PLATFORMS,
  SharePlatform,
  shareBlogPost,
} from '../../lib/blogShare';

const MENU_WIDTH = 220;
const MENU_EST_HEIGHT = 300;

const PLATFORM_ICONS: Partial<
  Record<SharePlatform, React.ComponentType<{ size?: number; className?: string }>>
> = {
  linkedin: Linkedin,
  twitter: Twitter,
  facebook: Facebook,
  email: Mail,
  copy: Link2,
  whatsapp: MessageCircle,
};

interface Props {
  slug: string;
  title: string;
  shareUrl?: string;
  sharesCount?: number;
  onSharesUpdate?: (count: number) => void;
  size?: 'sm' | 'md';
  className?: string;
  onFeedback?: (message: string) => void;
  menuAlign?: 'left' | 'right';
  showCount?: boolean;
}

const BlogShareActions: React.FC<Props> = ({
  slug,
  title,
  shareUrl,
  sharesCount = 0,
  onSharesUpdate,
  size = 'sm',
  className = '',
  onFeedback,
  menuAlign = 'right',
  showCount = false,
}) => {
  const [open, setOpen] = useState(false);
  const [localShares, setLocalShares] = useState(sharesCount);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, openUp: false });
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId().replace(/:/g, '');

  useEffect(() => {
    setLocalShares(sharesCount);
  }, [sharesCount]);

  const updateMenuPosition = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < MENU_EST_HEIGHT && rect.top > spaceBelow;

    let left =
      menuAlign === 'right'
        ? rect.right - MENU_WIDTH
        : rect.left;

    left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8));

    const top = openUp ? rect.top - 8 : rect.bottom + 8;

    setMenuPos({ top, left, openUp });
  }, [menuAlign]);

  useEffect(() => {
    if (!open) return;
    updateMenuPosition();
    const onScrollOrResize = () => updateMenuPosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        rootRef.current?.contains(target) ||
        document.getElementById(`blog-share-menu-${menuId}`)?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const iconSize = size === 'sm' ? 16 : 20;
  const btnClass = size === 'sm' ? 'p-2 rounded-xl' : 'p-2.5 rounded-xl';

  const handleShare = useCallback(
    async (platform: SharePlatform, e?: React.MouseEvent) => {
      e?.stopPropagation();
      e?.preventDefault();
      try {
        const res = await shareBlogPost(platform, slug, title, shareUrl);
        if (res.sharesCount !== undefined) {
          setLocalShares(res.sharesCount);
          onSharesUpdate?.(res.sharesCount);
        }
        onFeedback?.(res.message);
      } catch {
        onFeedback?.('Partage impossible');
      }
      setOpen(false);
    },
    [slug, title, shareUrl, onSharesUpdate, onFeedback]
  );

  const menu = open ? (
    <div
      id={`blog-share-menu-${menuId}`}
      role="menu"
      className="fixed z-[9999] min-w-[220px] max-h-[min(70vh,320px)] overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl p-2"
      style={{
        top: menuPos.openUp ? undefined : menuPos.top,
        bottom: menuPos.openUp ? window.innerHeight - menuPos.top : undefined,
        left: menuPos.left,
        width: MENU_WIDTH,
      }}
    >
      <p className="text-[9px] uppercase tracking-widest text-slate-500 px-3 py-2 font-bold sticky top-0 bg-white dark:bg-slate-900">
        Partager via
      </p>
      {SHARE_PLATFORMS.map(({ id, label }) => {
        const Icon = PLATFORM_ICONS[id];
        return (
          <button
            key={id}
            type="button"
            role="menuitem"
            onClick={(e) => handleShare(id, e)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-blue-500/10 hover:text-blue-600 transition-colors text-left"
          >
            {Icon ? <Icon size={18} /> : null}
            {label}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <div
      ref={rootRef}
      className={`relative inline-flex items-center gap-1.5 ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        ref={buttonRef}
        type="button"
        title="Partager"
        aria-label="Partager cet article"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!open) updateMenuPosition();
          setOpen((v) => !v);
        }}
        className={`${btnClass} text-slate-500 hover:text-blue-600 hover:bg-blue-500/10 dark:hover:bg-blue-500/15 border border-transparent hover:border-blue-500/20 transition-colors`}
      >
        <Share2 size={iconSize} className="text-blue-500" />
      </button>

      {showCount && localShares > 0 && (
        <span className="text-[10px] font-semibold text-slate-500 tabular-nums">{localShares}</span>
      )}

      {typeof document !== 'undefined' && menu && createPortal(menu, document.body)}
    </div>
  );
};

export default BlogShareActions;
