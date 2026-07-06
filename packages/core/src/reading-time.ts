/** Reading-time estimation for editorial content. */

const WORDS_PER_MINUTE = 225;
/** Each embedded image adds ~10 seconds of attention. */
const SECONDS_PER_IMAGE = 10;

/** Strip HTML/markdown-ish markup down to countable prose. */
export function toPlainText(input: string): string {
  return input
    .replace(/<[^>]+>/g, " ") // html tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // md images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // md links -> label
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(input: string): number {
  const text = toPlainText(input);
  if (!text) return 0;
  return text.split(" ").length;
}

export interface ReadingTime {
  minutes: number;
  words: number;
  /** Human label, e.g. "6 min read". */
  label: string;
}

export function estimateReadingTime(body: string, imageCount = 0): ReadingTime {
  const words = countWords(body);
  const seconds = (words / WORDS_PER_MINUTE) * 60 + imageCount * SECONDS_PER_IMAGE;
  const minutes = Math.max(1, Math.round(seconds / 60));
  return { minutes, words, label: `${minutes} min read` };
}
