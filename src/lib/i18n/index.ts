import { DEFAULT_LANG } from "@/src/constants";

export async function getDictionary(lang: string) {
  try {
    const dict = await import(`./${lang}.json`);
    return dict.default;
  } catch {
    console.error(`Failed to load dictionary for ${lang}, falling back to ${DEFAULT_LANG}`);
    const fallback = await import(`./${DEFAULT_LANG}.json`);
    return fallback.default;
  }
}
