import clsx from "clsx";
import styles from "./MyBallotEmbed.module.scss";
import { useForm } from "react-hook-form";
import { TextInput } from "components/TextInput/TextInput";
import { Button } from "components/Button/Button";
import {
  AddressInput,
  useElectionByIdQuery,
  useMyBallotByAddressQuery,
} from "generated";
import { get } from "http";
import { useState } from "react";
import { BallotContent } from "pages/ballot";
import { Race } from "components/Ballot/Race";
import { Box } from "components/Box/Box";
import { EmbedRace } from "components/RaceWidget/RaceWidget";
import { getYear } from "utils/dates";
import Divider from "components/Divider/Divider";

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
  const { defaultLanguage } = renderOptions || {};
  const [hasSubmitted, setHasSubmitted] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm<AddressInput>({});

  const submitForm = () => setHasSubmitted(true);

  const { data, isLoading } = useMyBallotByAddressQuery(
    {
      electionId,
      address: {
        // ...getValues(),
        line1: "1500 Garfield Ct, St. Cloud, MN 56301",
        line2: "",
        city: "St. Cloud",
        state: "MN",
        postalCode: "56301",
        country: "USA",
      },
    },
    {
      enabled: hasSubmitted,
      // &&
      // !!getValues().line1 &&
      // !!getValues().city &&
      // !!getValues().state &&
      // !!getValues().postalCode,
    }
  );

  const election = data?.electionById;

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
        <h4>Whats on my ballot?</h4>
        <Divider color="var(--grey-light)" style={{ margin: "0 0 1rem" }} />
        {!hasSubmitted && (
          <form
            onSubmit={handleSubmit(submitForm)}
            data-testid="my-ballot-address-form"
          >
            <TextInput
              name="line1"
              label="Address Line 1"
              register={register}
              control={control}
              error={errors?.line1}
            />
            <TextInput
              name="line2"
              label="Address Line 2"
              register={register}
              control={control}
              error={errors?.line2}
            />
            <TextInput
              name="city"
              label="City"
              register={register}
              control={control}
              error={errors?.city}
            />
            <TextInput
              name="state"
              label="State"
              register={register}
              control={control}
              error={errors?.state}
            />
            <TextInput
              name="postalCode"
              label="Postal Code"
              register={register}
              control={control}
              error={errors?.postalCode}
            />
            <Button type="submit" label="See Whats on My Ballot" />
          </form>
        )}
        {isLoading && <div>Loading...</div>}
        {data && !isLoading && (
          <div style={{ width: "100%" }}>
            {data.electionById.racesByAddress.map((race) => (
              <div key={race.id}>
                <div className={styles.raceHeader}>
                  <h3>{race.office.name}</h3>
                  <Divider vertical color="var(--grey-light)" />
                  <h4>{race.office.subtitle}</h4>
                </div>
                <div className={styles.raceContainer}>
                  <Race race={race} key={race.id} theme="light" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
