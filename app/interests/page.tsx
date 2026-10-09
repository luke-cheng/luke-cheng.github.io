import ProfileSectionPage from "@/app/_components/ProfileSectionPage";
import { getProfileSection } from "@/app/_lib/profile.server";

export default async function InterestsPage() {
  const profile = await getProfileSection("interests");
  return <ProfileSectionPage page="interests" {...profile} />;
}
