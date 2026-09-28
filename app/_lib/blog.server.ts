import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  filename: string;
};

const blogDirectory = path.join(process.cwd(), "content", "blogs");

function readFrontMatter(markdown: string) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return {};

  return Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .map((line) => line.match(/^([^:]+):\s*(.*)$/))
      .filter((entry): entry is RegExpMatchArray => Boolean(entry))
      .map(([, key, value]) => [key.trim(), value.trim().replace(/^['"]|['"]$/g, "")]),
  ) as Record<string, string>;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const files = (await readdir(blogDirectory)).filter((file) => file.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (filename): Promise<BlogPost> => {
      const markdown = await readFile(path.join(blogDirectory, filename), "utf8");
      const data = readFrontMatter(markdown);
      const slug = filename.replace(/\.md$/i, "");
      return {
        slug,
        title: data.title || slug.replace(/[-_]/g, " "),
        date: data.date || "",
        description: data.description || "A working note from Luke Cheng.",
        filename,
      };
    }),
  );

  return posts.sort((first, second) => second.date.localeCompare(first.date));
}

export async function getBlogPost(slug: string) {
  let normalizedSlug = slug;
  try {
    normalizedSlug = decodeURIComponent(slug);
  } catch {
    // Keep malformed route values as-is so the normal not-found path handles them.
  }

  const post = (await getBlogPosts()).find((item) => item.slug === normalizedSlug);
  if (!post) return null;

  return {
    ...post,
    draft: await readFile(path.join(blogDirectory, post.filename), "utf8"),
  };
}
