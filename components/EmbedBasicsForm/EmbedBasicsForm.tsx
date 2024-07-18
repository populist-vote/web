import { useQueryClient } from "@tanstack/react-query";
import { BillWidgetRenderOptions } from "components/BillWidget/BillWidget";
import { Button } from "components/Button/Button";
import { Checkbox } from "components/Checkbox/Checkbox";
import { PoliticianWidgetRenderOptions } from "components/PoliticianWidget/PoliticianWidget";
import { TextInput } from "components/TextInput/TextInput";
import {
  EmbedResult,
  EmbedType,
  UpsertEmbedInput,
  useEmbedByIdQuery,
  useUpsertEmbedMutation,
} from "generated";
import { useOrganizationContext } from "hooks/useOrganizationContext";
import { useRouter } from "next/router";
import { UseFormRegister, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type UpsertEmbedInputWithOptions = UpsertEmbedInput & {
  renderOptions: BillWidgetRenderOptions | PoliticianWidgetRenderOptions;
};

function BillEmbedOptionsForm({
  register,
}: {
  register: UseFormRegister<UpsertEmbedInputWithOptions>;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Checkbox
        id="issueTags"
        name="renderOptions.issueTags"
        label="Issue Tags"
        register={register}
      />
      <Checkbox
        id="Summary"
        name="renderOptions.summary"
        label="Summary"
        register={register}
      />
      <Checkbox
        id="Sponsors"
        name="renderOptions.sponsors"
        label="Sponsors"
        register={register}
      />
      <Checkbox
        id="publicVoting"
        name="renderOptions.publicVoting"
        label="Public Voting"
        register={register}
      />
    </div>
  );
}

function PoliticianEmbedOptionsForm({
  register,
}: {
  register: UseFormRegister<UpsertEmbedInputWithOptions>;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Checkbox
        id="upcomingRace"
        name="renderOptions.upcomingRace"
        label="Upcoming Race (if applicable)"
        register={register}
      />
      <Checkbox
        id="endorsements"
        name="renderOptions.endorsements"
        label="Endorsements"
        register={register}
      />
      <Checkbox
        id="stats"
        name="renderOptions.stats"
        label="Basic information"
        register={register}
      />
      <Checkbox
        id="socials"
        name="renderOptions.socials"
        label="Links"
        register={register}
      />
    </div>
  );
}

function EmbedBasicsForm({ embed }: { embed: EmbedResult | null }) {
  const router = useRouter();
  const upsertEmbed = useUpsertEmbedMutation();
  const queryClient = useQueryClient();
  const { currentOrganizationId } = useOrganizationContext();

  const { register, control, handleSubmit } =
    useForm<UpsertEmbedInputWithOptions>({
      defaultValues: {
        name: embed?.name,
        description: embed?.description,
        renderOptions: {
          issueTags: embed?.attributes?.renderOptions?.issueTags,
          summary: embed?.attributes?.renderOptions?.summary,
          sponsors: embed?.attributes?.renderOptions?.sponsors,
          upcomingRace: embed?.attributes?.renderOptions?.upcomingRace,
          stats: embed?.attributes?.renderOptions?.stats,
          endorsements: embed?.attributes?.renderOptions?.endorsements,
          socials: embed?.attributes?.renderOptions?.socials,
          publicVoting: embed?.attributes?.renderOptions?.publicVoting,
        },
      },
    });
  const onSubmit = (data: UpsertEmbedInputWithOptions) => {
    upsertEmbed.mutate(
      {
        input: {
          name: data.name,
          description: data.description,
          id: embed?.id,
          organizationId: currentOrganizationId as string,
          embedType: embed?.embedType,
          attributes: {
            ...embed?.attributes,
            renderOptions: data.renderOptions,
          },
        },
      },
      {
        onSuccess: () => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void queryClient.invalidateQueries({
            queryKey: useEmbedByIdQuery.getKey({
              id: router.query.id as string,
            }),
          });
        },
        onError: (error) => {
          toast((error as Error).message, { type: "error" });
        },
      }
    );
  };

  const renderOptions = () => {
    switch (embed?.embedType) {
      case EmbedType.Legislation:
        return <BillEmbedOptionsForm register={register} />;
      case EmbedType.Politician:
        return <PoliticianEmbedOptionsForm register={register} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <TextInput
          name="name"
          id="name"
          label="Name"
          placeholder={"My Embed"}
          size="small"
          register={register}
          control={control}
        />
        <TextInput
          name="description"
          id="description"
          label="Description"
          placeholder={"Legislative poll on prop 13"}
          size="small"
          register={register}
          control={control}
        />
        <div
          style={{
            width: "100%",
            height: "1px",
            borderTop: "1px solid var(--blue-dark)",
            margin: "1rem 0",
          }}
        />
        {renderOptions()}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <Button type="submit" variant="primary" size="medium" label="Save" />
      </div>
    </form>
  );
}

export { EmbedBasicsForm };
