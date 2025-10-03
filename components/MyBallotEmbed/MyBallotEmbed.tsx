import styles from "./MyBallotEmbed.module.scss";
import { useForm } from "react-hook-form";
import { TextInput } from "components/TextInput/TextInput";
import { Button } from "components/Button/Button";
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
import { useEffect, useState } from "react";
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

  // Variant detection
  const isEndorserVariant = Boolean(endorserId);

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
  defaultValues.state = "MN";

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

  // Get embed data to access organizationId (only when needed for endorser variant)
  const { data: embedData } = useEmbedByIdQuery(
    {
      id: embedId,
    },
    {
      enabled: isEndorserVariant,
    }
  );

  const organizationId = embedData?.embedById.organizationId;

  // Get organization data for endorser variant
  const { data: organizationData } = useOrganizationByIdQuery(
    {
      id: organizationId as string,
    },
    {
      enabled: !!organizationId && isEndorserVariant,
    }
  );

  const organization = organizationData?.organizationById;

  const { data, isLoading } = useMyBallotByAddressQuery(
    {
      electionId,
      address: {
        ...getValues(),
        state: "MN" as State,
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

  const election = electionData?.electionById;

  useEmbedResizer({ origin, embedId });

  if (electionIsLoading) return null;

  // Filter races to only show those with endorsed candidates when endorserId is provided
  const filteredRaces = data?.electionById.racesByAddress?.filter((race) => {
    // If no endorserId, show all races
    if (!isEndorserVariant) return true;

    // If endorserId is provided, only show races with endorsed candidates
    return race.candidates.length > 0;
  }) as RaceResult[];

  const races = filteredRaces || [];

  const {
    federal: federalRacesGroupedByOffice,
    state: stateRacesGroupedByOffice,
    local: localRacesGroupedByOffice,
    judicial: judicialRacesGroupedByOffice,
  } = splitRaces(races);

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
      <main>
        <div
          className={clsx(styles.flexBetween, styles.alignItemsCenter)}
          style={{ margin: "0 0 1rem" }}
        >
          <div className={clsx(styles.flexLeft, styles.gap75)}>
            {hasSubmitted && (
              <BsChevronLeft size={25} onClick={() => setHasSubmitted(false)} />
            )}
            <div className={styles.mainTitle}>
              {isEndorserVariant && organization ? (
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
          {!hasSubmitted && (
            <div className={clsx(styles.center, styles.addressForm)}>
              <form
                onSubmit={handleSubmit(submitForm)}
                data-testid="my-ballot-address-form"
              >
                {isEndorserVariant ? (
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
                    error={errors?.line1}
                    size="medium"
                  />
                </div>
                <div className={styles.secondRow}>
                  <TextInput
                    name="line2"
                    placeholder={t("apartment-line")}
                    register={register}
                    control={control}
                    error={errors?.line2}
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
                    error={errors?.city}
                    size="medium"
                  />
                  <TextInput
                    name="state"
                    placeholder={t("state")}
                    register={register}
                    rules={{ required: "State is required" }}
                    control={control}
                    error={errors?.state}
                    disabled
                    size="medium"
                  />
                  <TextInput
                    name="postalCode"
                    placeholder={t("postal-code")}
                    register={register}
                    rules={{ required: "Zip code is required" }}
                    control={control}
                    error={errors?.postalCode}
                    size="medium"
                  />
                </div>
                <div className={styles.centered}>
                  {isEndorserVariant ? (
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
          {data && !isLoading && hasSubmitted && (
            <div style={{ width: "100%" }}>
              {data.electionById.racesByAddress.length === 0 && (
                <div className={styles.noResults}>No Results</div>
              )}
              {isEndorserVariant ? (
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
                    />
                  )}
                  {(Object.keys(stateRacesGroupedByOffice).length > 0 ||
                    statewideBallotMeasures.length > 0) && (
                    <RaceSection
                      officeRaces={stateRacesGroupedByOffice}
                      label="State"
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
                    />
                  )}
                </>
              )}
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
                  hasIconMenu={false}
                  isEndorsement={false}
                  iconSize="1.25rem"
                  hasNote={false}
                  iconType="plus"
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
}: {
  officeRaces: Record<string, RaceResult[]>;
  label: string;
  size?: string;
  color?: FlagColor;
  children?: React.ReactNode;
}) {
  const { t } = useTranslation(["auth", "common", "embeds"]);

  return (
    <FlagSection {...{ label, size, color }}>
      {Object.values(officeRaces).map((races: RaceResult[]) => {
        return races.map((race) => {
          return (
            <div className={styles.raceGroup} key={race.id}>
              <div
                className={styles.flexBetween}
                style={{ marginBottom: "0.5rem" }}
              >
                <div className={styles.raceHeader}>
                  <h3>{race.office.name}</h3>
                  <Divider vertical color="var(--grey-light)" />
                  <h4>{race.office.subtitle}</h4>
                </div>
                <div className={styles.flexBetween}>
                  {race.voteType != VoteType.Plurality && (
                    <Badge size="small">{race.voteType}</Badge>
                  )}
                  {race.numElect && (
                    <Badge size="small" style={{ textTransform: "uppercase" }}>
                      {t("elect")} {race.numElect}
                    </Badge>
                  )}
                  {race.isSpecialElection && (
                    <Badge size="small" style={{ textTransform: "uppercase" }}>
                      Special Election
                    </Badge>
                  )}
                </div>
              </div>
              <div className={styles.raceContainer}>
                <Race
                  race={race as RaceResult}
                  key={race.id}
                  theme="light"
                  itemId={race.id}
                  isEmbedded={true}
                />
              </div>
              {race?.results.precinctReportingPercentage != null && (
                <div className={styles.resultsInfo}>
                  <small>
                    Vote totals update every 10 minutes after polls close.
                  </small>
                  <Badge size="small" theme="green" lightBackground>
                    {race?.results?.precinctReportingPercentage}% precincts
                    reporting
                  </Badge>
                </div>
              )}
              <Divider color="var(--grey-light)" />
              <RelatedEmbedLinks relatedEmbeds={race.relatedEmbeds} />
            </div>
          );
        });
      })}
      {children}
    </FlagSection>
  );
}

function RelatedEmbedLinks({
  relatedEmbeds,
}: {
  relatedEmbeds: EmbedResult[];
}) {
  const { t } = useTranslation(["auth", "common", "embeds"]);

  const getEmbedTypeTranslationKey = (embedType: EmbedType) => {
    const key = embedType.toLowerCase().replace("_", "-");
    return t(key, { ns: "embeds" });
  };

  if (!relatedEmbeds || relatedEmbeds.length === 0) return null;

  return (
    <ul className={styles.moreInfo}>
      {<h4>{t("more-info", { ns: "embeds" })}</h4>}
      {relatedEmbeds.flatMap((embed: EmbedResult) => {
        const populistUrl = `${window?.location?.origin}/embeds/preview/${embed.id}`;

        // Handle relatedEmbeds with origins
        if (embed.origins && embed.origins.length > 0) {
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
        }

        // If no origins, show a link with a Populist URL
        return (
          <li key={`${embed.id}-populist`}>
            <a href={populistUrl} target={"_blank"} rel={"noopener noreferrer"}>
              {getEmbedTypeTranslationKey(embed.embedType)}
              {" — "}
              {embed.race?.title} | Populist
            </a>
          </li>
        );
      })}
    </ul>
  );
}
