import { getProfileSection } from "@/app/_lib/profile.server";

export default async function InterestsPage() {
  const profile = await getProfileSection("interests");
  return (
    <main className="profile-content">
      <header className="page-heading">
        <h1>Interests and activities.</h1>
      </header>
      <article dangerouslySetInnerHTML={{ __html: profile.staticHtml }} />
    </main>
  );
}
