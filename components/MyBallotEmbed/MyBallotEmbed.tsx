import clsx from "clsx";
import styles from "./MyBallotEmbed.module.scss";
import { useForm } from "react-hook-form";
import { TextInput } from "components/TextInput/TextInput";
import { Button } from "components/Button/Button";
import {
  AddressInput,
  RaceResult,
  useBasicElectionByIdQuery,
  useMyBallotByAddressQuery,
  VoteType,
} from "generated";
import { useEffect, useState } from "react";
import { Race } from "components/Ballot/Race";
import { getYear } from "utils/dates";
import Divider from "components/Divider/Divider";
import { Badge } from "components/Badge/Badge";
import { LanguageSelect } from "components/LanguageSelect/LanguageSelect";
import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import { BsChevronLeft } from "react-icons/bs";
import { useRouter } from "next/router";

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

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<AddressInput>({});

  const submitForm = () => setHasSubmitted(true);

  const { data: electionData, isLoading: electionIsLoading } =
    useBasicElectionByIdQuery({
      id: electionId,
    });

  const { data, isLoading } = useMyBallotByAddressQuery(
    {
      electionId,
      address: {
        ...getValues(),
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

  if (electionIsLoading) return null;

  return (
    <div
      className={clsx(styles.widgetContainer, styles.candidateGuideContainer)}
    >
      <header className={styles.header}>
        <strong>{election?.title}</strong>
        <span className={styles.electionInfo}>
          <strong>{getYear(election?.electionDate)}</strong>
        </span>
      </header>
      <main>
        <div className={styles.flexBetween} style={{ margin: "0 0 1rem" }}>
          <div className={styles.flexLeft}>
            {hasSubmitted && (
              <BsChevronLeft size={25} onClick={() => setHasSubmitted(false)} />
            )}
            <h4 className={styles.mainTitle}>Whats on my ballot?</h4>
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
                <p>
                  Enter the address where you’re registered to vote so we can
                  show you what’s on your ballot. We do not save your personal
                  information.
                </p>
                <div className={styles.firstRow}>
                  <TextInput
                    name="line1"
                    label="Address Line 1"
                    register={register}
                    rules={{ required: "Address line 1 is required" }}
                    control={control}
                    error={errors?.line1}
                  />
                </div>
                <div className={styles.secondRow}>
                  <TextInput
                    name="line2"
                    label="Address Line 2"
                    register={register}
                    control={control}
                    error={errors?.line2}
                  />
                </div>

                <div className={styles.thirdRow}>
                  <TextInput
                    name="city"
                    label="City"
                    register={register}
                    rules={{ required: "City is required" }}
                    control={control}
                    error={errors?.city}
                  />
                  <TextInput
                    name="state"
                    label="State"
                    register={register}
                    rules={{ required: "State is required" }}
                    control={control}
                    error={errors?.state}
                  />
                  <TextInput
                    name="postalCode"
                    label="Postal Code"
                    register={register}
                    rules={{ required: "Postal code is required" }}
                    control={control}
                    error={errors?.postalCode}
                  />
                </div>
                <div className={styles.centered}>
                  <Button
                    type="submit"
                    label="See Whats on My Ballot"
                    disabled={!isValid}
                  />
                </div>
              </form>
            </div>
          )}
          {isLoading && <div>Loading...</div>}
          {data && !isLoading && hasSubmitted && (
            <div style={{ width: "100%" }}>
              {data.electionById.racesByAddress.length === 0 && (
                <div className={styles.noResults}>No Results</div>
              )}
              {data.electionById.racesByAddress.map((race) => (
                <div key={race.id}>
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
                        <Badge size="small">Elect {race.numElect}</Badge>
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
