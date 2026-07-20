import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/layout/Section";

export function ProfilePage() {
  return (
    <>
      <PageHeader
        kicker="Account"
        title="Profile"
        description="Preferences, dietary context, public contribution settings, and account details will land here."
      />
      <Section title="Profile foundation" description="Authentication is out of scope for this first slice." />
    </>
  );
}
