// CJK-aware reading time. Chinese: 300 CPM, English: 220 WPM.
export function readingTime(markdown: string): { minutes: number; words: number } {
  if (!markdown) return { minutes: 1, words: 0 };
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^\)]*\)/g, "$1")
    .replace(/[#>*_~\-]+/g, " ");

  const chinese = (stripped.match(/[一-鿿㐀-䶿]/g) || []).length;
  const latinWords = (stripped.replace(/[一-鿿㐀-䶿]/g, "").match(/\b[\w’']+\b/g) || []).length;
  const minutes = Math.max(1, Math.ceil(chinese / 300 + latinWords / 220));
  return { minutes, words: chinese + latinWords };
}
