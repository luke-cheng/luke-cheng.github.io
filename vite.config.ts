import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type BlogPostIndex = {
  slug: string;
  file: string;
  title: string;
  date: string;
  description: string;
};

const blogDirectory = path.resolve("public/blog");

function frontMatter(markdown: string) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return {};

  return Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .map((line) => line.match(/^([^:]+):\s*(.*)$/))
      .filter((entry): entry is RegExpMatchArray => Boolean(entry))
      .map(([, key, value]) => [key.trim(), value.trim().replace(/^['"]|['"]$/g, "")]),
  );
}

async function createBlogIndex() {
  await mkdir(blogDirectory, { recursive: true });
  const files = (await readdir(blogDirectory)).filter((file) => file.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (file): Promise<BlogPostIndex> => {
      const markdown = await readFile(path.join(blogDirectory, file), "utf8");
      const data = frontMatter(markdown);
      const slug = file.replace(/\.md$/, "");
      return {
        slug,
        file: `blog/${file}`,
        title: data.title || slug.replace(/[-_]/g, " "),
        date: data.date || "",
        description: data.description || "A working note from Luke Cheng.",
      };
    }),
  );

  posts.sort((a, b) => b.date.localeCompare(a.date));
  await writeFile(path.join(blogDirectory, "index.json"), `${JSON.stringify(posts, null, 2)}\n`);
}

function blogIndexPlugin(): Plugin {
  return {
    name: "blog-index",
    buildStart: createBlogIndex,
    configureServer(server: ViteDevServer) {
      server.watcher.add(blogDirectory);
      server.watcher.on("all", (_event: string, changedPath: string) => {
        if (changedPath.startsWith(blogDirectory) && changedPath.endsWith(".md")) {
          void createBlogIndex();
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), blogIndexPlugin()],
  base: "/",
});
