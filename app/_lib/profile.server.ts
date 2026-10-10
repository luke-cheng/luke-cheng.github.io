import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderMarkdown } from "@/app/_lib/markdown";

export type ProfilePage = "work" | "interests";

const SECTION_TITLES: Record<ProfilePage, string[]> = {
  work: ["Experience"],
  interests: ["Leadership & Activities", "Interests & Hobbies"],
};

function pickSections(markdown: string, titles: string[]) {
  const selectedTitles = new Set(titles);
  let includeSection = false;

  return markdown
    .split(/\r?\n/)
    .filter((line) => {
      const heading = line.match(/^##\s+(.+)$/);
      if (heading) includeSection = selectedTitles.has(heading[1].trim());
      return includeSection;
    })
    .join("\n");
}

export async function getProfileSection(page: ProfilePage) {
  const contentDirectory = path.resolve(process.cwd(), process.env.CONTENT_DIR ?? "content-source");
  let portfolio: string;
  try {
    portfolio = await readFile(path.join(contentDirectory, "LukeCheng.md"), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    // Local checkouts do not necessarily include the ignored content repository.
    // The deployment copies the same source to public/portfolio.md for the browser
    // AI, so use it as a static-page fallback during local development.
    portfolio = await readFile(path.join(process.cwd(), "public", "portfolio.md"), "utf8");
  }
  const source = pickSections(portfolio, SECTION_TITLES[page]);

  return { source, staticHtml: renderMarkdown(source) };
}
