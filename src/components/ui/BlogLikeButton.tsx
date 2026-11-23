import { useState } from "react";
import { Heart } from "lucide-react";
import { useBlogLikes } from "../../hooks/useBlogLikes";

export function BlogLikeButton({ slug }: { slug: string }) {
  const { likes, failed, setLiked } = useBlogLikes();
  const [saving, setSaving] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const post = likes[slug];

  async function toggle() {
    if (!post || saving) return;
    setSaving(true);
    setSaveFailed(false);
    try {
      await setLiked(slug, !post.liked);
    } catch {
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="blog-like-action">
      <button
        type="button"
        className="blog-likes"
        disabled={!post || saving}
        aria-pressed={post?.liked ?? false}
        aria-label={
          post ? `Like this post, ${post.count} likes` : "Like this post"
        }
        onClick={toggle}
      >
        <Heart
          size={16}
          fill={post?.liked ? "currentColor" : "none"}
          aria-hidden="true"
        />
        <span aria-hidden="true">{post?.count ?? "–"}</span>
      </button>
      <span className="blog-like-status" role="status">
        {failed
          ? "Likes unavailable"
          : saveFailed
            ? "Could not save. Try again."
            : ""}
      </span>
    </div>
  );
}
