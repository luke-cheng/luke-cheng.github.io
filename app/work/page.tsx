import { getProfileSection } from "@/app/_lib/profile.server";

export default async function WorkPage() {
  const profile = await getProfileSection("work");
  return (
    <main className="profile-content">
      <header className="page-heading">
        <h1>Work experience</h1>
      </header>
      <article dangerouslySetInnerHTML={{ __html: profile.staticHtml }} />
    </main>
  );
}
