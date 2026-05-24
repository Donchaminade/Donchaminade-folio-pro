import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send } from 'lucide-react';
import {
  BlogComment,
  BlogPostDetail,
  toggleBlogLike,
  postBlogComment,
  isApiConfigured,
  countBlogComments,
} from '../../lib/api';
import CommentThread from './CommentThread';
import BlogShareActions from './BlogShareActions';

interface Props {
  post: BlogPostDetail;
  onUpdate: (patch: Partial<BlogPostDetail>) => void;
}

const BlogEngagement: React.FC<Props> = ({ post, onUpdate }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes_count);
  const [shares, setShares] = useState(post.shares_count);
  const [comments, setComments] = useState<BlogComment[]>(post.comments);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const totalComments = countBlogComments(comments);

  const applyCommentsUpdate = (tree: BlogComment[], count: number) => {
    setComments(tree);
    onUpdate({ comments: tree, comments_count: count });
  };

  const handleLike = async () => {
    if (!isApiConfigured()) return;
    try {
      const res = await toggleBlogLike(post.slug);
      setLiked(res.liked);
      setLikes(res.likes_count);
      onUpdate({ liked: res.liked, likes_count: res.likes_count });
    } catch {
      setFeedback('Impossible de liker pour le moment.');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setLoading(true);
    setFeedback('');
    try {
      const res = await postBlogComment(post.slug, name.trim(), content.trim());
      setFeedback(res.message);
      applyCommentsUpdate(res.comments, res.comments_count);
      setName('');
      setContent('');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Erreur envoi');
    } finally {
      setLoading(false);
    }
  };

  const onReplyPosted = (tree: BlogComment[], count: number, message: string) => {
    applyCommentsUpdate(tree, count);
    setFeedback(message);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleLike}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${
            liked
              ? 'bg-red-500/20 border-red-500/50 text-red-400'
              : 'glass border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-red-500/40'
          }`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {likes}
        </motion.button>

        <BlogShareActions
          slug={post.slug}
          title={post.title}
          shareUrl={post.share_url}
          sharesCount={shares}
          onSharesUpdate={(count) => {
            setShares(count);
            onUpdate({ shares_count: count });
          }}
          onFeedback={setFeedback}
          size="md"
          showCount
        />
      </div>

      {feedback && (
        <p className="text-sm font-medium px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400">
          {feedback}
        </p>
      )}

      <section className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.03]">
          <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <MessageCircle size={22} className="text-blue-500" />
            Discussion
            <span className="text-sm font-bold text-slate-500 normal-case tracking-normal">
              ({totalComments} {totalComments <= 1 ? 'message' : 'messages'})
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Publiez ou répondez directement — visible tout de suite. Utilisez « Répondre » sous un message.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((c) => (
                <CommentThread
                  key={c.id}
                  comment={c}
                  slug={post.slug}
                  onReplyPosted={onReplyPosted}
                  onError={setFeedback}
                />
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm font-light text-center py-6">Soyez le premier à lancer la discussion.</p>
          )}

          <form
            onSubmit={handleComment}
            className="mt-8 p-6 rounded-2xl border border-dashed border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900/40 space-y-4"
          >
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Nouveau commentaire</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              className="w-full px-4 py-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Partagez votre avis sur cet article…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm resize-none focus:outline-none focus:border-blue-500 text-slate-900 dark:text-white"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all"
            >
              <Send size={16} /> Publier
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogEngagement;
