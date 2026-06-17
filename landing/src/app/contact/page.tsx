import type { Metadata } from "next";
import { InfoPage, issuesUrl, repoUrl } from "../info-page";

export const metadata: Metadata = {
  title: "Contact MyPets",
  description:
    "Contact paths for MyPets support, bug reports, and project questions.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Contact MyPets"
      description="MyPets uses public project channels so support context stays attached to the source code."
    >
      <h2>Project contact</h2>
      <p>
        For bugs, compatibility notes, or setup questions, open a thread in{" "}
        <a href={issuesUrl}>MyPets GitHub Issues</a>. For source review, release history, and
        project files, visit the <a href={repoUrl}>MyPets GitHub repository</a>.
      </p>
    </InfoPage>
  );
}
