import { useQueryClient } from "@tanstack/react-query";
import { Button } from "components/Button/Button";
import { Checkbox } from "components/Checkbox/Checkbox";
import { TextInput } from "components/TextInput/TextInput";
import {
  EmbedResult,
  UpsertEmbedInput,
  useEmbedByIdQuery,
  useUpsertEmbedMutation,
} from "generated";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import { UseFormRegister, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type BillRenderOptions = {
  issueTags: boolean;
  summary: boolean;
  sponsors: boolean;
};

type PoliticianRenderOptions = {
  bio: boolean;
};

type UpsertEmbedInputWithOptions = UpsertEmbedInput & {
  renderOptions: BillRenderOptions | PoliticianRenderOptions;
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
    </div>
  );
}

function EmbedForm({ embed }: { embed: EmbedResult | null }) {
  const router = useRouter();
  const { user } = useAuth({ redirect: false });
  const upsertEmbed = useUpsertEmbedMutation();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm<UpsertEmbedInputWithOptions>({
    defaultValues: {
      name: embed?.name,
      description: embed?.description,
      renderOptions: {
        issueTags: embed?.attributes?.renderOptions?.issueTags,
        summary: embed?.attributes?.renderOptions?.summary,
        sponsors: embed?.attributes?.renderOptions?.sponsors,
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
          populistUrl: `${window.location.origin}/embed/${embed?.id}`,
          organizationId: user?.organizationId as string,
          attributes: {
            ...embed?.attributes,
            renderOptions: data.renderOptions,
          },
        },
      },
      {
        onSuccess: () => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void queryClient.invalidateQueries(
            useEmbedByIdQuery.getKey({ id: router.query.id as string })
          );
        },
        onError: (error) => {
          toast((error as Error).message, { type: "error" });
        },
      }
    );
  };

  const renderOptions = () => {
    switch (embed?.attributes?.embedType) {
      case "legislation":
        return <BillEmbedOptionsForm register={register} />;
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
        />
        <TextInput
          name="description"
          id="description"
          label="Description"
          placeholder={"Legislative poll on prop 13"}
          size="small"
          register={register}
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

export { EmbedForm };
