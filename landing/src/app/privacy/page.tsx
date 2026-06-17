import type { Metadata } from "next";
import { InfoPage } from "../info-page";

export const metadata: Metadata = {
  title: "MyPets Privacy",
  description:
    "Privacy notes for MyPets, a local-first pixel desktop companion.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <InfoPage
      eyebrow="Privacy"
      title="MyPets Privacy"
      description="MyPets is designed as a local-first desktop companion."
    >
      <h2>Local app data</h2>
      <p>
        MyPets is described as local-first because settings, stats, imported companions, and focus
        history stay on your machine by default. The app does not require a MyPets account to use
        the core desktop companion experience.
      </p>
      <h2>External services</h2>
      <p>
        The website links to external services such as GitHub and PetDex for source code, releases,
        and companion packages. Those services apply their own privacy terms when you visit them.
      </p>
    </InfoPage>
  );
}
