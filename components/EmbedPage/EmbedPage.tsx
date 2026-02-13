import clsx from "clsx";
import { BillWidget } from "components/BillWidget/BillWidget";
import { Box } from "components/Box/Box";
import { EmbedBasicsForm } from "components/EmbedBasicsForm/EmbedBasicsForm";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import {
  EmbedResult,
  EmbedType,
  useDeleteEmbedMutation,
  useEmbedByIdQuery,
  useEmbedDeploymentsQuery,
} from "generated";
import { toast } from "react-toastify";
import styles from "./EmbedPage.module.scss";
import { Button } from "components/Button/Button";
import { useRouter } from "next/router";
import { PoliticianEmbed } from "components/PoliticianEmbed/PoliticianEmbed";
import { QuestionEmbedForm } from "pages/dashboard/[dashboardSlug]/embeds/question/new";
import { EmbedCodeBlock } from "components/EmbedCodeBlock/EmbedCodeBlock";
import { QuestionWidget } from "components/QuestionWidget/QuestionWidget";
import { PollEmbedForm } from "pages/dashboard/[dashboardSlug]/embeds/poll/new";
import { PollWidget } from "components/PollWidget/PollWidget";
import { RaceWidget } from "components/RaceWidget/RaceWidget";
import { BillTrackerWidget } from "components/BillTrackerWidget/BillTrackerWidget";
import { CandidateGuideEmbed } from "components/CandidateGuideEmbed/CandidateGuideEmbed";
import { RiExternalLinkFill, RiEyeFill } from "react-icons/ri";
import { getRelativeTimeString } from "utils/dates";
import { ImageWithFallback } from "components/ImageWithFallback/ImageWithFallback";
import Link from "next/link";
import { Tooltip } from "components/Tooltip/Tooltip";
import { MyBallotEmbed } from "components/MyBallotEmbed/MyBallotEmbed";

function EmbedPage({
  id,
  embedType,
  children,
}: {
  id: string;
  embedType: EmbedType;
  children?: React.ReactNode;
}) {
  const { data, isLoading } = useEmbedByIdQuery({
    id,
  });

  if (isLoading) return <LoaderFlag />;

  const billIds = data?.embedById?.attributes?.billIds as string[];
  const billId = data?.embedById?.attributes?.billId as string;
  const candidateGuideId = data?.embedById?.attributes
    ?.candidateGuideId as string;
  const raceId = data?.embedById?.attributes?.raceId as string;
  const electionId = data?.embedById?.attributes?.electionId as string;
  const endorserId = data?.embedById?.attributes?.endorserId as string;
  const embed = data?.embedById as EmbedResult;

  const renderOptions = embed?.attributes?.renderOptions;

  const renderPreviewByType = () => {
    switch (embedType) {
      case EmbedType.Legislation:
        return (
          <BillWidget
            billId={billId}
            origin={window.location.origin}
            embedId={id}
            renderOptions={renderOptions}
          />
        );
      case EmbedType.LegislationTracker:
        return (
          <BillTrackerWidget
            embedId={id}
            origin={window.location.origin}
            billIds={billIds}
            renderOptions={{ tbd: false }}
          />
        );
      case EmbedType.Politician:
        return (
          <PoliticianEmbed
            origin={window.location.origin}
            embedId={id}
            renderOptions={renderOptions}
          />
        );
      case EmbedType.Race:
        return (
          <RaceWidget
            raceId={raceId}
            embedId={id}
            origin={window.location.origin}
            renderOptions={renderOptions}
          />
        );
      case EmbedType.Question:
        return <QuestionWidget embedId={id} origin={window.location.origin} />;
      case EmbedType.Poll:
        return <PollWidget embedId={id} origin={window.location.origin} />;
      case EmbedType.CandidateGuide:
        return (
          <CandidateGuideEmbed
            embedId={id}
            candidateGuideId={candidateGuideId}
            origin={window.location.origin}
            renderOptions={renderOptions}
          />
        );
      case EmbedType.MyBallot:
        return (
          <MyBallotEmbed
            embedId={id}
            electionId={electionId}
            origin={window.location.origin}
            renderOptions={renderOptions}
            {...(endorserId && { endorserId })}
          />
        );
    }
  };

  return (
    <div className={styles.content}>
      {/* Options Section */}
      <div className={clsx(styles.options)}>
        <div>
          <h3>Configuration</h3>
          <Box>
            {embedType === EmbedType.Question ? (
              <QuestionEmbedForm buttonLabel="Save" embedId={embed.id} />
            ) : embedType === EmbedType.Poll ? (
              <PollEmbedForm buttonLabel="Save" embedId={embed.id} />
            ) : (
              <EmbedBasicsForm embed={embed} />
            )}
          </Box>
        </div>
        <div className={clsx(styles.embedCode)}>
          <h3>Embed Code</h3>
          <EmbedCodeBlock id={id} />
        </div>
        <EmbedDeployments embedId={embed.id} />
        <div className={styles.dangerZone}>
          <h3>Danger Zone</h3>
          <DeleteEmbedButton id={id} embedType={embedType} />
        </div>
      </div>

      {/* Preview Section */}
      <div className={clsx(styles.preview)}>
        <div>
          <h3>Preview</h3>
          <Box>{renderPreviewByType()}</Box>
        </div>
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
}

export { EmbedPage };

export function EmbedDeployments({ embedId }: { embedId: string }) {
  const { data, isLoading } = useEmbedDeploymentsQuery(
    { id: embedId },
    {
      enabled: !!embedId,
    }
  );
  const embed = data?.embedById as EmbedResult;
  if (!embed) return null;
  if (isLoading) return <LoaderFlag />;
  return (
    <div className={styles.deploymentsContainer}>
      <h3>Deployments</h3>

      {embed.origins?.length == 0 && (
        <Box>
          <small className={styles.noResults}>No deployments</small>
        </Box>
      )}
      <div className={styles.deployments}>
        {embed.origins?.map(({ url, lastPingAt }) => (
          <div className={styles.deploymentRow} key={url}>
            <div className={styles.flexLeft} style={{ width: "100%" }}>
              <ImageWithFallback
                height="25"
                width="25"
                alt={"favicon"}
                src={`https://www.google.com/s2/favicons?domain=${url}`}
                fallbackSrc={"/images/favicon.ico"}
              />
              <Link
                href={url}
                key={`${embed.id + url}`}
                target="_blank"
                rel="noreferrer"
                className={clsx(styles.linkParent, styles.clamp2)}
              >
                {url}
              </Link>
            </div>
            <div className={styles.flexBetween} style={{ width: "100%" }}>
              {lastPingAt && (
                <div className={styles.flexRight}>
                  <RiEyeFill color="var(--salmon)" />
                  <small style={{ fontStyle: "italic" }}>
                    Last view {getRelativeTimeString(new Date(lastPingAt))}
                  </small>
                </div>
              )}
              <div>
                <Tooltip content="Visit Page">
                  <button
                    className={styles.iconButton}
                    onClick={() => window.open(url, "_blank")}
                  >
                    <RiExternalLinkFill color="var(--blue-text-light)" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeleteEmbedButton({
  id,
  embedType,
}: {
  id: string;
  embedType: string;
}) {
  const router = useRouter();

  const deleteEmbedMutation = useDeleteEmbedMutation();

  const handleDelete = () => {
    confirm("Are you sure you want to delete this embed?") &&
      deleteEmbedMutation.mutate(
        {
          id,
        },
        {
          onSuccess: () => {
            void router.push(
              `/dashboard/${router.query.dashboardSlug}/embeds/${embedType.toLowerCase().replace("_", "-")}`
            );
            toast("Embed deleted", {
              type: "success",
              position: "bottom-right",
            });
          },
        }
      );
  };

  return (
    <Button
      theme="red"
      variant="secondary"
      label="Delete Embed"
      size="small"
      onClick={handleDelete}
    />
  );
}
