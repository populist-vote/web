import { Button } from "components";
import { Modal } from "components/Modal/Modal";
import {
  useOrganizationBySlugQuery,
  useUpsertCandidateGuideMutation,
} from "generated";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function NewEmbedModal({
  isOpen,
  onClose,
  slug,
}: {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}) {
  const router = useRouter();

  const { data: organizationData } = useOrganizationBySlugQuery({
    slug: slug as string,
  });

  const organizationId = organizationData?.organizationBySlug?.id;

  // Close modal when route chagnes
  useEffect(() => {
    const handleRouteChange = () => {
      onClose();
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [onClose, router.events]);

  const upsertCandidateGuideMutation = useUpsertCandidateGuideMutation();

  const handleNewCandidateGuideEmbed = () => {
    // Create the candidate_guide record, then pass its ID to create a new embed record
    upsertCandidateGuideMutation.mutate(
      {
        input: { name: "Untitled", organizationId },
      },
      {
        onSuccess: (data) => {
          void router.push(
            `/dashboard/${slug}/candidate-guides/${data.upsertCandidateGuide.id}`
          );
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignContent: "center",
        }}
      >
        <h2>New Embed</h2>
        <p style={{ fontSize: "16px" }}>
          Select the type of content you'd like to embed.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <Link
            href="/dashboard/[slug]/embeds/legislation/new"
            as={`/dashboard/${slug}/embeds/legislation/new`}
          >
            <Button variant="super" size="large" label="Legislation" />
          </Link>

          <Link
            href="/dashboard/[slug]/embeds/legislation-tracker/new"
            as={`/dashboard/${slug}/embeds/legislation-tracker/new`}
          >
            <Button variant="super" size="large" label="Legislation Tracker" />
          </Link>

          <Link
            href="/dashboard/[slug]/embeds/politician/new"
            as={`/dashboard/${slug}/embeds/politician/new`}
          >
            <Button variant="super" size="large" label="Politician" />
          </Link>

          <Link
            href="/dashboard/[slug]/embeds/race/new"
            as={`/dashboard/${slug}/embeds/race/new`}
          >
            <Button variant="super" size="large" label="Race" />
          </Link>

          <Link
            href="/dashboard/[slug]/embeds/question/new"
            as={`/dashboard/${slug}/embeds/question/new`}
          >
            <Button variant="super" size="large" label="Question" />
          </Link>

          <Link
            href="/dashboard/[slug]/embeds/poll/new"
            as={`/dashboard/${slug}/embeds/poll/new`}
          >
            <Button variant="super" size="large" label="Poll" />
          </Link>
          <Button
            variant="super"
            size="large"
            label="Candidate Guide"
            disabled={upsertCandidateGuideMutation.isPending}
            onClick={handleNewCandidateGuideEmbed}
          />
        </div>
      </div>
    </Modal>
  );
}
