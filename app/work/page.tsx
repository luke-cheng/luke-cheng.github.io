import { getProfileSection } from "@/app/_lib/profile.server";

export default async function WorkPage() {
  const profile = await getProfileSection("work");
  return <main className="profile-content"><p className="eyebrow">Work</p><h1>Work experience</h1><article dangerouslySetInnerHTML={{ __html: profile.staticHtml }} /></main>;
}
