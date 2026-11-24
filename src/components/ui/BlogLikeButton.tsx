import { Heart } from "lucide-react";

export function BlogLikeCount({ count }: { count?: number }) {
  return count && count > 0 ? (
    <span className="blog-like-count" key={count} aria-hidden="true">
      {count}
    </span>
  ) : null;
}

type BlogLikeButtonProps = {
  post?: { count: number; liked: boolean };
  disabled: boolean;
  onToggle: () => void;
};

export function BlogLikeButton({
  post,
  disabled,
  onToggle,
}: BlogLikeButtonProps) {
  const action = post?.liked ? "Unlike this post" : "Like this post";

  return (
    <button
      type="button"
      className="blog-likes blog-like-button"
      disabled={disabled}
      aria-pressed={post?.liked ?? false}
      aria-label={post ? `${action}, ${post.count} likes` : action}
      onClick={onToggle}
    >
      <Heart
        size={16}
        fill={post?.liked ? "currentColor" : "none"}
        aria-hidden="true"
      />
      <BlogLikeCount count={post?.count} />
    </button>
  );
}
