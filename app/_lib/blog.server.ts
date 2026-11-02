import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
  filename: string;
};

// Content is checked out by the Pages workflow from luke-cheng/luke-cheng.
// Keeping it outside public prevents the source Markdown from becoming part of
// the site artifact except where a page deliberately renders it.
const contentDirectory = path.resolve(process.cwd(), process.env.CONTENT_DIR ?? "content-source");
const blogDirectory = path.join(contentDirectory, "blogs");
const execFileAsync = promisify(execFile);

function getTitleFromFilename(filename: string) {
  return filename
    .replace(/\.md$/i, "")
    .replace(/[-_]/g, " ")
    .trim();
}

async function getGitAddedDate(filePath: string) {
  try {
    const { stdout } = await execFileAsync("git", [
      "log",
      "--diff-filter=A",
      "--follow",
      "--format=%aI",
      "--reverse",
      "--",
      filePath,
    ]);
    const firstCommitDate = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);
    return firstCommitDate ? firstCommitDate.slice(0, 10) : "";
  } catch {
    return "";
  }
}

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
  let files: string[];
  try {
    files = (await readdir(blogDirectory)).filter((file) => file.endsWith(".md"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const posts = await Promise.all(
    files.map(async (filename): Promise<BlogPost> => {
      const filePath = path.join(blogDirectory, filename);
      const markdown = await readFile(filePath, "utf8");
      const data = readFrontMatter(markdown);
      const slug = filename.replace(/\.md$/i, "");
      return {
        slug,
        title: getTitleFromFilename(filename),
        date: (await getGitAddedDate(filePath)) || data.date || "",
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
