import type { Metadata } from "next";
import { InfoPage, repoUrl } from "../info-page";

export const metadata: Metadata = {
  title: "About MyPets",
  description:
    "About MyPets, the local-first pixel desktop companion for breaks, hydration, focus, and coding-agent activity nudges.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <InfoPage
      eyebrow="About"
      title="About MyPets"
      description="MyPets is a pixel desktop companion for macOS and Windows."
    >
      <h2>Product intent</h2>
      <p>
        MyPets keeps a small animated companion on screen so reminders feel ambient instead of
        like another dashboard. It supports break nudges, hydration reminders, focus protection,
        companion imports, and local activity prompts for coding-agent workflows.
      </p>
      <h2>Project source</h2>
      <p>
        MyPets is maintained in the public <a href={repoUrl}>MyPets GitHub repository</a>, where
        visitors can review source code, release notes, and issue history.
      </p>
    </InfoPage>
  );
}
