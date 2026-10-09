import ProfileSectionPage from "@/app/_components/ProfileSectionPage";
import { getProfileSection } from "@/app/_lib/profile.server";

export default async function WorkPage() {
  const profile = await getProfileSection("work");
  return <ProfileSectionPage page="work" {...profile} />;
}
