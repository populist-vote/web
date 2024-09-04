import clsx from "clsx";
import styles from "./MyBallotEmbed.module.scss";
import { useForm } from "react-hook-form";
import { TextInput } from "components/TextInput/TextInput";

interface MyBallotEmbedRenderOptions {
  defaultLanguage?: string;
}

export function MyBallotEmbed({
  embedId,
  origin,
  renderOptions,
}: {
  embedId: string;
  origin: string;
  renderOptions?: MyBallotEmbedRenderOptions;
}) {
  const { defaultLanguage } = renderOptions || {};

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({});

  const submitForm = () => {
    console.log("submitting form");
  };

  return (
    <div
      className={clsx(styles.widgetContainer, styles.candidateGuideContainer)}
    >
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
          name="zip"
          label="ZIP"
          register={register}
          control={control}
          error={errors?.zip}
        />
      </form>
    </div>
  );
}
