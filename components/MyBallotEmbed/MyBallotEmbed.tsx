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

  return (
    <div
      className={clsx(styles.widgetContainer, styles.candidateGuideContainer)}
    >
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
        <div>
          <h2>My Ballot</h2>
          {data.electionById.racesByAddress.map((race) => (
            <Race race={race} theme="light" />
          ))}
        </div>
      )}
    </div>
  );
}
