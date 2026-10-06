import { readFile } from "node:fs/promises";
import path from "node:path";
import type { SitePage } from "../_components/SiteHeader";
import { renderMarkdown } from "./markdown";

export type ProfilePage = Exclude<SitePage, "home" | "thoughts">;

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
  const portfolio = await readFile(path.join(contentDirectory, "LukeCheng.md"), "utf8");
  const source = pickSections(portfolio, SECTION_TITLES[page]);

  return { source, staticHtml: renderMarkdown(source) };
}
