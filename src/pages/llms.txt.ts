import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../consts";
import { extractDescription } from "../utils/description";

export async function GET(_context: APIContext) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const grouped = new Map<string, typeof posts>();
  for (const p of posts) {
    const list = grouped.get(p.data.category) ?? [];
    list.push(p);
    grouped.set(p.data.category, list);
  }

  const lines: string[] = [];
  lines.push(`# ${SITE_TITLE}`);
  lines.push("");
  lines.push(`> ${SITE_DESCRIPTION}`);
  lines.push("");
  lines.push(
    "作者 Harry Chang — 軟體開發 10 年，從 0 到 1 打造過產品，也從無到有拉起過團隊。這個 blog 記錄踩過的坑與想通的事，涵蓋 .NET、架構設計、敏捷實踐等主題。",
  );
  lines.push("");
  lines.push(`Site: ${SITE_URL}/`);
  lines.push(`RSS: ${SITE_URL}/rss.xml`);
  lines.push(`Sitemap: ${SITE_URL}/sitemap-index.xml`);
  lines.push("");

  for (const [category, list] of grouped) {
    lines.push(`## ${category}`);
    lines.push("");
    for (const post of list) {
      const desc = extractDescription(post.body, {
        description: post.data.description,
        subtitle: post.data.subtitle,
        maxLen: 180,
      });
      const url = `${SITE_URL}/${post.id}/`;
      const date = post.data.date.toISOString().slice(0, 10);
      lines.push(`- [${post.data.title}](${url}) — ${date}`);
      if (desc) lines.push(`  ${desc}`);
      if (post.data.tags.length) {
        lines.push(`  Tags: ${post.data.tags.join(", ")}`);
      }
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
