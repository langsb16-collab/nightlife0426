import { Post } from "@/src/types";

/**
 * Generates a thumbnail URL for a post.
 * Prioritizes uploaded images, then falls back to a category-based AI generated image.
 */
export function getThumbnail(post: Post): string {
  if (post.images && post.images.length > 0) {
    return post.images[0]; // Use first uploaded image
  }

  // Use the post title as the primary prompt for better specificity
  // Fallback to category if title is missing
  const basePrompt = post.title || post.category || "modern lifestyle";

  // Using pollinations.ai for high-quality fallback images with theme keywords
  // Added seed based on post id for consistency
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    basePrompt + " high quality professional photography samsung blue theme"
  )}?width=800&height=600&nologo=true&seed=${encodeURIComponent(post.id)}`;
}
