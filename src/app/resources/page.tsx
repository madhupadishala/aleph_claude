import { PageIntro } from "@/components/PageIntro";
import { ResourceTools } from "@/components/ResourceTools";
export const metadata = {
  title: "Free practice tools",
  alternates: { canonical: "/resources" },
};
export default function ResourcesPage() {
  return (
    <main className="page-wrap">
      <PageIntro
        eyebrow="YOUR PRACTICAL STARTING POINT"
        title="Small tools. Meaningful progress."
      >
        Work through a fee scenario, sharpen your public profile, or prepare a
        clearer reply. No account required.
      </PageIntro>
      <ResourceTools />
    </main>
  );
}
