import clsx from "clsx";
import styles from "./MyBallotEmbed.module.scss";
import { useForm } from "react-hook-form";
import { TextInput } from "components/TextInput/TextInput";
import { Button } from "components/Button/Button";
import {
  AddressInput,
  EmbedType,
  RaceResult,
  State,
  useBasicElectionByIdQuery,
  useMyBallotByAddressQuery,
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

interface MyBallotEmbedRenderOptions {
  defaultLanguage?: string;
}

export function MyBallotEmbed({
  embedId,
  electionId,
  origin,
  renderOptions,
}: {
  embedId: string;
  electionId: string;
  origin: string;
  renderOptions?: MyBallotEmbedRenderOptions;
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

  const { data, isLoading } = useMyBallotByAddressQuery(
    {
      electionId,
      address: {
        ...getValues(),
        state: "MN" as State,
        country: "USA",
      },
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

  const getEmbedTypeTranslationKey = (embedType: EmbedType) => {
    const key = embedType.toLowerCase().replace("_", "-");
    return t(key, { ns: "embeds" });
  };

  if (electionIsLoading) return null;

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
        <div className={styles.flexBetween} style={{ margin: "0 0 1rem" }}>
          <div className={styles.flexLeft}>
            {hasSubmitted && (
              <BsChevronLeft size={25} onClick={() => setHasSubmitted(false)} />
            )}
            <h4 className={styles.mainTitle}>
              {t("whats-on-my-ballot", { ns: "embeds" })}
            </h4>
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
                <p>{t("enter-address-explainer", { ns: "embeds" })}</p>
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
                  <Button
                    type="submit"
                    size="medium"
                    label={t("my-ballot-submit", { ns: "embeds" })}
                    disabled={!isValid}
                  />
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
              {data.electionById.racesByAddress.map((race) => (
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
                        <Badge size="small">
                          {t("elect")} {race.numElect}
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
                    />
                  </div>
                  {race.relatedEmbeds.some(
                    (embed) => embed.origins.length > 0
                  ) && (
                    <>
                      <ul className={styles.moreInfo}>
                        <h4>{t("more-info", { ns: "embeds" })}</h4>
                        {race.relatedEmbeds?.flatMap((embed) =>
                          embed.origins?.map((origin) => {
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
                                  {origin.pageTitle ?? origin.url}{" "}
                                </a>
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <WidgetFooter />
    </div>
  );
}
