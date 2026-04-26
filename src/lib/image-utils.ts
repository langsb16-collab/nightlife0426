import { Category } from "@/src/types";

export function getPromptForCategory(category: Category): string {
  const prompts: Record<Category, string> = {
    jobs: "modern office workers business meeting professional",
    realestate: "luxury apartment interior modern architecture",
    market: "second hand market items electronics vintage",
    drink: "friends drinking bar night life social",
    promo: "business promotion marketing digital growth",
    food: "delicious restaurant food fine dining gourmet"
  };
  return prompts[category] || "modern community platform";
}

export function getPlaceholderImage(category: Category): string {
  const prompt = encodeURIComponent(getPromptForCategory(category));
  return `https://image.pollinations.ai/prompt/${prompt}?width=800&height=600&nologo=true`;
}
