import React from "react";
import { Post } from "@/src/types";
import { ThumbsUp, ThumbsDown, MapPin, MessageCircle, Share2, MoreVertical } from "lucide-react";
import { getThumbnail } from "@/src/lib/thumbnail";
import { cn } from "@/src/lib/utils";

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onDislike: () => void;
  onChat: () => void;
  onClick: () => void;
}

/**
 * SafeButton pattern to handle event propagation and errors
 */
function SafeButton({ 
  onClick, 
  children, 
  className,
}: { 
  onClick?: () => void | Promise<void>; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await onClick?.();
        } catch (err) {
          console.error("Button action failed:", err);
        }
      }}
      className={cn(
        "transition-all duration-200 active:scale-95",
        className
      )}
    >
      {children}
    </button>
  );
}

export default function PostCard({ post, onLike, onDislike, onChat, onClick }: PostCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div 
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className="glass-card overflow-hidden group cursor-pointer"
    >
      {/* Image/Video Section */}
      <div className="aspect-video relative overflow-hidden bg-white/5">
        <img
          src={getThumbnail(post)}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://picsum.photos/seed/${post.category}/800/600`;
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600/80 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-white font-bold text-base leading-tight group-hover:text-blue-400 transition-colors line-clamp-1">
            {post.title}
          </h3>
          <SafeButton className="text-white/20 hover:text-white">
            <MoreVertical size={16} />
          </SafeButton>
        </div>
        <p className="text-white/40 text-xs line-clamp-2 mb-4 leading-relaxed font-medium">
          {post.content}
        </p>

        <div className="flex items-center gap-2 text-white/30 text-[10px] mb-4 font-bold uppercase tracking-wider">
          <MapPin size={12} className="text-blue-500/50" />
          <span className="truncate">{post.address}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <SafeButton
              onClick={onLike}
              className="flex items-center gap-1.5 text-white/40 hover:text-blue-400"
            >
              <ThumbsUp size={16} />
              <span className="text-[10px] font-black">{post.likes}</span>
            </SafeButton>
            <SafeButton
              onClick={onDislike}
              className="flex items-center gap-1.5 text-white/40 hover:text-red-400"
            >
              <ThumbsDown size={16} />
              <span className="text-[10px] font-black">{post.dislikes}</span>
            </SafeButton>
          </div>
          <div className="flex items-center gap-2">
            <SafeButton
              onClick={onChat}
              className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full"
            >
              <MessageCircle size={16} />
            </SafeButton>
            <SafeButton className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full">
              <Share2 size={16} />
            </SafeButton>
          </div>
        </div>
      </div>
    </div>
  );
}
