import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reply, Send, ShieldCheck, X } from 'lucide-react';
import { BlogComment, postBlogComment } from '../../lib/api';

interface Props {
  comment: BlogComment;
  slug: string;
  depth?: number;
  onReplyPosted: (comments: BlogComment[], count: number, message: string) => void;
  onError?: (message: string) => void;
}

const CommentThread: React.FC<Props> = ({ comment, slug, depth = 0, onReplyPosted, onError }) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdmin = comment.is_admin || comment.author_role === 'admin';
  const maxDepth = 6;
  const canReply = depth < maxDepth;

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setLoading(true);
    try {
      const res = await postBlogComment(slug, name.trim(), content.trim(), undefined, comment.id);
      onReplyPosted(res.comments, res.comments_count, res.message);
      setName('');
      setContent('');
      setReplyOpen(false);
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'Erreur envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className={`relative ${depth > 0 ? 'mt-4' : ''}`} style={{ marginLeft: depth > 0 ? Math.min(depth * 20, 80) : 0 }}>
      {depth > 0 && (
        <div className="absolute -left-3 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 to-transparent" aria-hidden />
      )}

      <div
        className={`rounded-2xl border p-5 transition-colors ${
          isAdmin
            ? 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10'
            : 'border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03]'
        }`}
      >
        <header className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black uppercase ${
                isAdmin ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              {comment.author_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{comment.author_name}</span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                    <ShieldCheck size={10} /> Auteur
                  </span>
                )}
              </div>
              <time className="text-[10px] text-slate-500 uppercase tracking-widest">
                {new Date(comment.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
            </div>
          </div>
        </header>

        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>

        {canReply && (
          <button
            type="button"
            onClick={() => setReplyOpen((v) => !v)}
            className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors"
          >
            {replyOpen ? <X size={14} /> : <Reply size={14} />}
            {replyOpen ? 'Annuler' : 'Répondre'}
          </button>
        )}

        <AnimatePresence>
          {replyOpen && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleReply}
              className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 space-y-3 overflow-hidden"
            >
              <p className="text-xs text-slate-500">
                En réponse à <strong className="text-slate-700 dark:text-slate-300">{comment.author_name}</strong>
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Votre réponse…"
                rows={3}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm resize-none focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest rounded-xl"
              >
                <Send size={14} /> Envoyer
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              slug={slug}
              depth={depth + 1}
              onReplyPosted={onReplyPosted}
              onError={onError}
            />
          ))}
        </div>
      )}
    </article>
  );
};

export default CommentThread;
