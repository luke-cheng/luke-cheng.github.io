import ProfileSectionPage from "../_components/ProfileSectionPage";
import { getProfileSection } from "../_lib/profile.server";

export default async function InterestsPage() {
  const profile = await getProfileSection("interests");
  return <ProfileSectionPage page="interests" {...profile} />;
}
