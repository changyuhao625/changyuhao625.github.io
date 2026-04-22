import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts";
import { extractDescription } from "../utils/description";

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: posts.map((p) => ({
      title: p.data.title,
      pubDate: p.data.date,
      description: extractDescription(p.body, {
        description: p.data.description,
        subtitle: p.data.subtitle,
        maxLen: 280,
      }),
      link: `/${p.id}/`,
      categories: p.data.tags,
      author: p.data.author,
    })),
  });
}
