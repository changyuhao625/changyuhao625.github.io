/**
 * Extract a meta description from a post's markdown body.
 *
 * Rules (in order of precedence):
 *  1. If explicit `description` is provided, use it.
 *  2. If `subtitle` is provided, use it.
 *  3. If the body contains `<!--more-->`, use everything before it (Jekyll excerpt semantics).
 *  4. Otherwise take the first meaningful paragraph.
 *
 * Strips markdown syntax but does NOT fabricate or paraphrase — this is purely
 * a mechanical extraction from the author's own text.
 */
export function extractDescription(
  body: string | undefined,
  opts: { description?: string; subtitle?: string; maxLen?: number } = {},
): string {
  const { description, subtitle, maxLen = 160 } = opts;
  if (description && description.trim()) return truncate(description.trim(), maxLen);
  if (subtitle && subtitle.trim()) return truncate(subtitle.trim(), maxLen);
  if (!body) return "";

  const more = body.indexOf("<!--more-->");
  const head = more >= 0 ? body.slice(0, more) : body;

  const plain = stripMarkdown(head);
  return truncate(plain, maxLen);
}

export function stripMarkdown(md: string): string {
  return md
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^\)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^\)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s*#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return cut.replace(/[,，、。.!?！？:：;；—\-]+$/, "") + "…";
}
