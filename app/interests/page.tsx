import { getProfileSection } from "@/app/_lib/profile.server";

export default async function InterestsPage() {
  const profile = await getProfileSection("interests");
  return (
    <main className="profile-content">
      <p className="eyebrow">Interests</p>
      <h1>Interests, activities, and things I think about.</h1>
      <article dangerouslySetInnerHTML={{ __html: profile.staticHtml }} />
    </main>
  );
}
