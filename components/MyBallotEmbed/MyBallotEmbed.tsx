import styles from "./MyBallotEmbed.module.scss";
import { useForm } from "react-hook-form";
import { TextInput } from "components/TextInput/TextInput";
import { Button } from "components/Button/Button";
import states from "utils/states";
import {
  AddressInput,
  ElectionScope,
  EmbedResult,
  EmbedType,
  PoliticalParty,
  RaceResult,
  State,
  useBasicElectionByIdQuery,
  useEmbedByIdQuery,
  useMyBallotByAddressQuery,
  useOrganizationByIdQuery,
  VoteType,
} from "generated";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Race } from "components/Ballot/Race";
import Divider from "components/Divider/Divider";
import { Badge } from "components/Badge/Badge";
import { LanguageSelect } from "components/LanguageSelect/LanguageSelect";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import { BsChevronLeft } from "react-icons/bs";
import { useRouter } from "next/router";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { useTranslation } from "next-i18next";
import { splitRaces } from "utils/data";
import { FlagColor, FlagSection } from "components/FlagSection/FlagSection";
import { BallotMeasureCard } from "components/BallotMeasureCard/BallotMeasureCard";
import { getYear } from "utils/dates";
import { PartyAvatar } from "components";
import { OrganizationAvatar } from "components/Avatar/Avatar";
import Link from "next/link";
import { default as clsx } from "clsx";

export interface MyBallotEmbedRenderOptions {
  defaultLanguage?: string;
  height?: number;
  isEndorserVariant?: boolean;
}

export function MyBallotEmbed({
  embedId,
  electionId,
  origin,
  renderOptions,
  endorserId,
}: {
  embedId: string;
  electionId: string;
  origin: string;
  renderOptions?: MyBallotEmbedRenderOptions;
  endorserId?: string;
}) {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation(["auth", "common", "embeds"]);

  /// Handle default language
  useEffect(() => {
    if (renderOptions?.defaultLanguage) {
      void router.push(router.asPath, router.asPath, {
        locale: renderOptions?.defaultLanguage,
        scroll: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderOptions?.defaultLanguage]);

  const defaultValues = JSON.parse(
    localStorage.getItem("addressValues") || "{}"
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<AddressInput>({
    defaultValues,
  });

  const [hasSubmitted, setHasSubmitted] = useState(() => {
    return localStorage.getItem("hasSubmitted") === "true";
  });

  // State to track whether to show all races or just endorsed candidates
  const [showAllRaces, setShowAllRaces] = useState(false);

  const submitForm = () => {
    const addressValues = getValues();
    localStorage.setItem("addressValues", JSON.stringify(addressValues));
    localStorage.setItem("hasSubmitted", "true");
    setHasSubmitted(true);
  };

  const { data: electionData, isLoading: electionIsLoading } =
    useBasicElectionByIdQuery({
      id: electionId,
    });

  // Get embed data to access organizationId
  const { data: embedData } = useEmbedByIdQuery(
    {
      id: embedId,
    },
    {
      enabled: true, // Always fetch to get organizationId for filtering related embeds
    }
  );

  const organizationId = embedData?.embedById.organizationId;

  // Get organization data for endorser variant
  const { data: organizationData } = useOrganizationByIdQuery(
    {
      id: organizationId as string,
    },
    {
      enabled: !!organizationId && !!endorserId,
    }
  );

  const organization = organizationData?.organizationById;

  const { data, isLoading } = useMyBallotByAddressQuery(
    {
      electionId,
      address: {
        ...getValues(),
        state: getValues().state?.toUpperCase() as State,
        country: "USA",
      },
      endorserId: endorserId || undefined,
    },
    {
      enabled:
        hasSubmitted &&
        !!getValues().line1 &&
        !!getValues().city &&
        !!getValues().state &&
        !!getValues().postalCode,
    }
  );

  // Get all races without endorser filter when showing all races
  const { data: allRacesData, isLoading: allRacesLoading } =
    useMyBallotByAddressQuery(
      {
        electionId,
        address: {
          ...getValues(),
          state: getValues().state?.toUpperCase() as State,
          country: "USA",
        },
        // No endorserId filter to get all candidates
      },
      {
        enabled:
          hasSubmitted &&
          !!getValues().line1 &&
          !!getValues().city &&
          !!getValues().state &&
          !!getValues().postalCode &&
          !!endorserId &&
          showAllRaces,
      }
    );

  const election = electionData?.electionById;

  useEmbedResizer({ origin, embedId });

  if (electionIsLoading) return null;

  // Choose the appropriate data source based on toggle state
  const currentData = endorserId && showAllRaces ? allRacesData : data;

  // Filter races based on endorser variant and toggle state
  const filteredRaces = currentData?.electionById.racesByAddress?.filter(
    (race) => {
      // If no endorserId, show all races
      if (!endorserId) return true;

      // If endorserId is provided and showAllRaces is true, show all races
      if (showAllRaces) return true;

      // If endorserId is provided and showAllRaces is false, only show races with endorsed candidates
      return race.candidates.length > 0;
    }
  ) as RaceResult[];

  const races = filteredRaces || [];

  // Get endorsed candidate IDs for each race when showing all races
  const getEndorsedCandidateIds = (raceId: string) => {
    if (!endorserId || !showAllRaces || !data) return [];
    const raceWithEndorsements = data.electionById.racesByAddress?.find(
      (r) => r.id === raceId
    );
    return raceWithEndorsements?.candidates.map((c) => c.id) || [];
  };

  // Use the same races for grouping
  const racesForGrouping = races;

  const {
    federal: federalRacesGroupedByOffice,
    state: stateRacesGroupedByOffice,
    local: localRacesGroupedByOffice,
    judicial: judicialRacesGroupedByOffice,
  } = splitRaces(racesForGrouping);

  const ballotMeasures = data?.electionById.ballotMeasuresByAddress;

  const statewideBallotMeasures =
    ballotMeasures?.filter((bm) => bm.electionScope === ElectionScope.State) ||
    [];

  const localBallotMeasures =
    ballotMeasures?.filter(
      (bm) =>
        bm.electionScope === ElectionScope.County ||
        bm.electionScope === ElectionScope.City ||
        bm.electionScope === ElectionScope.District
    ) || [];

  return (
    <div
      className={clsx(styles.widgetContainer, styles.candidateGuideContainer)}
      style={{
        height: renderOptions?.height ? `${renderOptions.height}px` : "auto",
        minHeight: renderOptions?.height ?? "fit-content",
      }}
    >
      <header className={styles.header}>
        <strong>{election?.title}</strong>
        <span className={styles.electionInfo}>
          <strong>
            {new Date(election?.electionDate).toLocaleDateString(
              `${locale}-US`,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              }
            )}
          </strong>
        </span>
      </header>
      <main className={styles.main}>
        <div
          className={clsx(styles.flexBetween, styles.alignItemsCenter)}
          style={{ margin: "0 0 1rem" }}
        >
          <div className={clsx(styles.flexLeft, styles.gap75)}>
            {hasSubmitted && (
              <BsChevronLeft size={25} onClick={() => setHasSubmitted(false)} />
            )}
            <div className={styles.mainTitle}>
              {endorserId && organization ? (
                <div className={styles.endorserTitle}>
                  <OrganizationAvatar
                    src={organization.assets?.thumbnailImage160 as string}
                    alt={organization.name}
                    size={80}
                  />
                  <div className={styles.endorserText}>
                    <span className={styles.orgName}>{organization.name}</span>
                    <h4>{t("our-endorsements", { ns: "embeds" })}</h4>
                  </div>
                </div>
              ) : (
                <h4>{t("whats-on-my-ballot", { ns: "embeds" })}</h4>
              )}
            </div>
          </div>
          <LanguageSelect />
        </div>
        <Divider color="var(--grey-light)" style={{ margin: "0 0 1rem" }} />

        <div className={styles.content}>
          {/* Address form for non-endorser variant */}
          {!hasSubmitted && (
            <div className={clsx(styles.center, styles.addressForm)}>
              <form
                onSubmit={handleSubmit(submitForm)}
                data-testid="my-ballot-address-form"
              >
                {/* Endorser variant: Show explainer for endorser variant */}
                {endorserId ? (
                  <p>
                    {t("enter-address-explainer-endorsements", {
                      ns: "embeds",
                    })}
                  </p>
                ) : (
                  <p>{t("enter-address-explainer", { ns: "embeds" })}</p>
                )}
                <div className={styles.firstRow}>
                  <TextInput
                    name="line1"
                    placeholder={t("street-address")}
                    register={register}
                    rules={{ required: "Address line 1 is required" }}
                    control={control}
                    error={errors?.line1?.message}
                    size="medium"
                  />
                </div>
                <div className={styles.secondRow}>
                  <TextInput
                    name="line2"
                    placeholder={t("apartment-line")}
                    register={register}
                    control={control}
                    error={errors?.line2?.message}
                    size="medium"
                  />
                </div>

                <div className={styles.thirdRow}>
                  <TextInput
                    name="city"
                    placeholder={t("city")}
                    register={register}
                    rules={{ required: "City is required" }}
                    control={control}
                    error={errors?.city?.message}
                    size="medium"
                  />
                  <TextInput
                    name="state"
                    placeholder={t("state")}
                    register={register}
                    rules={{
                      required: "State is required",
                      maxLength: {
                        value: 2,
                        message: "State code must be 2 characters",
                      },
                      validate: (value) => {
                        const upperValue = String(value || "").toUpperCase();
                        return (
                          Object.keys(states).includes(upperValue) ||
                          "Invalid state code"
                        );
                      },
                    }}
                    control={control}
                    error={errors?.state?.message}
                    size="medium"
                    maxLength={2}
                  />
                  <TextInput
                    name="postalCode"
                    placeholder={t("postal-code")}
                    register={register}
                    rules={{ required: "Zip code is required" }}
                    control={control}
                    error={errors?.postalCode?.message}
                    size="medium"
                  />
                </div>
                <div
                  className={clsx(
                    styles.centered,
                    styles.submitAddressButtonContainer
                  )}
                >
                  {endorserId ? (
                    <Button
                      type="submit"
                      size="medium"
                      label={t("my-ballot-submit-endorsements", {
                        ns: "embeds",
                      })}
                      disabled={!isValid}
                    />
                  ) : (
                    <Button
                      type="submit"
                      size="medium"
                      label={t("my-ballot-submit", { ns: "embeds" })}
                      disabled={!isValid}
                    />
                  )}
                </div>
              </form>
            </div>
          )}
          {isLoading && <LoaderFlag theme="gray" />}
          {/* Main ballot container */}
          {data && !isLoading && hasSubmitted && (
            <div className={styles.ballotContainer}>
              {data.electionById.racesByAddress.length === 0 ? (
                <div className={styles.noResults}>No races on your ballot</div>
              ) : allRacesLoading ? (
                <div className={styles.loaderFlagContainer}>
                  <LoaderFlag theme="gray" />
                </div>
              ) : endorserId && !showAllRaces ? (
                // Endorser variant: Show endorsed candidates in a simplified layout

                <div className={styles.allEndorsementsContainer}>
                  {races.length === 0 ? (
                    <div className={styles.noResults}>
                      No endorsements on your ballot
                    </div>
                  ) : (
                    races.map((race) => (
                      <EndorsedCandidate race={race} key={race.id} />
                    ))
                  )}
                </div>
              ) : (
                // Standard variant: Show full ballot with races and ballot measures
                <>
                  {Object.keys(federalRacesGroupedByOffice).length > 0 && (
                    <RaceSection
                      officeRaces={federalRacesGroupedByOffice}
                      label="Federal"
                      endorserId={endorserId}
                      showAllRaces={showAllRaces}
                      getEndorsedCandidateIds={getEndorsedCandidateIds}
                      organizationId={organizationId}
                    />
                  )}
                  {(Object.keys(stateRacesGroupedByOffice).length > 0 ||
                    statewideBallotMeasures.length > 0) && (
                    <RaceSection
                      officeRaces={stateRacesGroupedByOffice}
                      label="State"
                      endorserId={endorserId}
                      showAllRaces={showAllRaces}
                      getEndorsedCandidateIds={getEndorsedCandidateIds}
                      organizationId={organizationId}
                    >
                      {statewideBallotMeasures?.map((measure) => (
                        <BallotMeasureCard
                          measure={measure}
                          year={getYear(election?.electionDate)}
                          key={measure.id}
                        />
                      ))}
                    </RaceSection>
                  )}

                  {(Object.keys(localRacesGroupedByOffice).length > 0 ||
                    localBallotMeasures?.length > 0) && (
                    <RaceSection
                      officeRaces={localRacesGroupedByOffice}
                      label="Local"
                      endorserId={endorserId}
                      showAllRaces={showAllRaces}
                      getEndorsedCandidateIds={getEndorsedCandidateIds}
                      organizationId={organizationId}
                    >
                      {localBallotMeasures?.map((measure) => (
                        <BallotMeasureCard
                          measure={measure}
                          year={getYear(election?.electionDate)}
                          key={measure.id}
                        />
                      ))}
                    </RaceSection>
                  )}
                  {Object.keys(judicialRacesGroupedByOffice).length > 0 && (
                    <RaceSection
                      officeRaces={judicialRacesGroupedByOffice}
                      label="Judicial"
                      endorserId={endorserId}
                      showAllRaces={showAllRaces}
                      getEndorsedCandidateIds={getEndorsedCandidateIds}
                      organizationId={organizationId}
                    />
                  )}
                </>
              )}
            </div>
          )}
          {endorserId &&
            hasSubmitted &&
            data &&
            !isLoading &&
            data.electionById.racesByAddress.length > 0 && (
              <div className={styles.toggleContainer}>
                <Button
                  size="medium"
                  label={
                    showAllRaces
                      ? "Show Only Endorsed Candidates"
                      : "Show All Races & Candidates"
                  }
                  onClick={() => setShowAllRaces(!showAllRaces)}
                />
              </div>
            )}
        </div>
      </main>
      <WidgetFooter />
    </div>
  );
}

function EndorsedCandidate({ race }: { race: RaceResult }) {
  const incumbentIds = race?.office?.incumbents?.map((i) => i.id) || [];
  const theme = "light"; // Use light theme for endorser variant

  return (
    <div className={styles.endorsedCandidateContainer}>
      <div className={styles.officeHeader}>
        <h3>{race.office.name}</h3>
        {race.office.subtitleShort && <h3>{race.office.subtitleShort}</h3>}
      </div>

      <div className={styles.raceContainer}>
        {race.candidates.map((politician) => {
          const politicianLink = `/politicians/${encodeURIComponent(politician?.slug)}`;

          return (
            <div
              className={styles.candidateContainer}
              style={{ height: "auto" }}
              key={politician.id}
            >
              {incumbentIds?.includes(politician.id) && (
                <span
                  className={styles.sideText}
                  style={{ color: "var(--grey)" }}
                >
                  INCUMBENT
                </span>
              )}

              <Link
                className={styles.avatarContainer}
                href={politicianLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PartyAvatar
                  theme={theme}
                  size={80}
                  hasIconMenu={true}
                  isEndorsement={true}
                  iconSize="1.25rem"
                  hasNote={false}
                  iconType="star"
                  handleEndorseCandidate={() => {}}
                  handleUnendorseCandidate={() => {}}
                  handleAddNote={() => {}}
                  party={politician?.party as PoliticalParty}
                  src={politician?.assets?.thumbnailImage160 as string}
                  alt={politician.fullName}
                  readOnly={true}
                  href={politicianLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  labelLeft={undefined}
                  opaque={false}
                />
                <span
                  className={clsx(
                    styles.link,
                    styles.avatarName,
                    styles[theme]
                  )}
                >
                  {politician.fullName}
                </span>
              </Link>

              {incumbentIds?.includes(politician.id) &&
                race.candidates?.length > 1 && (
                  <Divider vertical color="var(--grey-light)" />
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RaceSection({
  officeRaces,
  label,
  size = "small",
  color = "grey",
  children,
  endorserId,
  showAllRaces,
  getEndorsedCandidateIds,
  organizationId,
}: {
  officeRaces: Record<string, RaceResult[]>;
  label: string;
  size?: string;
  color?: FlagColor;
  children?: React.ReactNode;
  endorserId?: string;
  showAllRaces?: boolean;
  getEndorsedCandidateIds?: (raceId: string) => string[];
  organizationId?: string;
}) {
  const { t } = useTranslation(["auth", "common", "embeds"]);

  return (
    <FlagSection {...{ label, size, color }}>
      {Object.values(officeRaces).map((races: RaceResult[]) => {
        const groupKey = races[0]?.office?.id ?? races[0]?.id ?? Math.random();
        const race = races[0];
        return (
          <div className={styles.raceGroup} key={groupKey}>
            <div
              className={styles.flexBetween}
              style={{ marginBottom: "0.5rem" }}
            >
              <div className={styles.raceHeader}>
                <h3>{race?.office.name}</h3>
                <Divider vertical color="var(--grey-light)" />
                <h4>{race?.office.subtitle}</h4>
              </div>
              <div className={styles.flexBetween}>
                {race?.voteType != VoteType.Plurality && (
                  <Badge size="small">{race?.voteType}</Badge>
                )}
                {race?.numElect && (
                  <Badge size="small" style={{ textTransform: "uppercase" }}>
                    {t("elect")} {race?.numElect}
                  </Badge>
                )}
                {race?.isSpecialElection && (
                  <Badge size="small" style={{ textTransform: "uppercase" }}>
                    Special Election
                  </Badge>
                )}
              </div>
            </div>
            <div className={styles.raceContainer}>
              {/* Render each race in the group */}
              {races.map((race) => (
                <Fragment key={race.id}>
                  <Race
                    race={race as RaceResult}
                    key={race.id}
                    theme="light"
                    itemId={race.id}
                    isEmbedded={true}
                    endorserId={endorserId}
                    endorsedCandidateIds={
                      endorserId && showAllRaces && getEndorsedCandidateIds
                        ? getEndorsedCandidateIds(race.id)
                        : undefined
                    }
                  />
                </Fragment>
              ))}
            </div>
            {race?.results.precinctReportingPercentage != null && (
              <>
                <div className={styles.resultsInfo}>
                  <small>
                    Vote totals update every 10 minutes after polls close.
                  </small>
                  <Badge size="small" theme="green" lightBackground>
                    {race?.results?.precinctReportingPercentage}% precincts
                    reporting
                  </Badge>
                </div>
              </>
            )}
            <RelatedEmbedLinks races={races} organizationId={organizationId} />
          </div>
        );
      })}
      {children}
    </FlagSection>
  );
}

function RelatedEmbedLinks({
  races,
  organizationId,
}: {
  races: RaceResult[];
  organizationId?: string;
}) {
  const { t } = useTranslation(["auth", "common", "embeds"]);

  // Aggregate relatedEmbeds from all races, dedupe by embed id
  const relatedEmbeds = useMemo(() => {
    const all = (races ?? []).flatMap((race) => race.relatedEmbeds ?? []);
    const seen = new Set<string>();
    return all.filter((embed) => {
      if (seen.has(embed.id)) return false;
      seen.add(embed.id);
      return true;
    });
  }, [races]);

  const getEmbedTypeTranslationKey = (embedType: EmbedType) => {
    const key = embedType.toLowerCase().replace("_", "-");
    return t(key, { ns: "embeds" });
  };

  if (!relatedEmbeds || relatedEmbeds.length === 0) {
    return null;
  }

  // Only show embeds that have external origins AND belong to the same organization
  const embedsWithOrigins = relatedEmbeds.filter(
    (embed) =>
      embed.origins &&
      embed.origins.length > 0 &&
      (!organizationId || embed.organizationId === organizationId)
  );

  // console.log("[RelatedEmbedLinks]", {
  //   embedsWithOriginsLength: embedsWithOrigins.length,
  //   embedDetails: relatedEmbeds.map((e) => ({
  //     id: e.id,
  //     originsLength: e.origins?.length ?? 0,
  //     organizationId: e.organizationId,
  //     matchesOrg: !organizationId || e.organizationId === organizationId,
  //   })),
  // });

  // If no embeds have origins, don't show the More Info section at all
  if (embedsWithOrigins.length === 0) {
    // console.log(
    //   "[RelatedEmbedLinks] early exit: no embeds with origins / org match"
    // );
    return null;
  }

  return (
    <>
      <ul className={styles.moreInfo}>
        {<h4>{t("more-info", { ns: "embeds" })}</h4>}
        {embedsWithOrigins.flatMap((embed: EmbedResult) => {
          // Show only external origin links
          return embed.origins.map((origin) => {
            if (!origin) return null;
            return (
              <li key={`${embed.id}-${origin.url}`}>
                <a
                  href={origin.url}
                  target={"_blank"}
                  rel={"noopener noreferrer"}
                >
                  {getEmbedTypeTranslationKey(embed.embedType)}
                  {" — "}
                  {origin.pageTitle ?? origin.url}
                </a>
              </li>
            );
          });
        })}
      </ul>
    </>
  );
}
