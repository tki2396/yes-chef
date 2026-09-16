import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/layout/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader";

export function DraftPage() {
  return (
    <>
      <PageHeader
        kicker="Draft review"
        title="Recipe Draft"
        description="A future review surface for imports and AI-assisted parsing before a recipe is saved."
      />
      <EmptyState
        icon={ClipboardList}
        title="Draft review scaffold"
        description="Drafts stay editable and private until the user saves them into the recipe library."
      />
    </>
  );
}
