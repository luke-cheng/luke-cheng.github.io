import ProfileSectionPage from "../_components/ProfileSectionPage";
import { getProfileSection } from "../_lib/profile.server";

export default async function WorkPage() {
  const profile = await getProfileSection("work");
  return <ProfileSectionPage page="work" {...profile} />;
}
