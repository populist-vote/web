import { Button } from "components/Button/Button";
import { TextInput } from "components/TextInput/TextInput";
import {
  EmbedResult,
  UpsertEmbedInput,
  useUpsertEmbedMutation,
} from "generated";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function EmbedForm({
  slug,
  embed,
}: {
  slug: string;
  embed: EmbedResult | null;
}) {
  const router = useRouter();
  const { user } = useAuth({ redirect: false });
  const upsertEmbed = useUpsertEmbedMutation();
  const { register, handleSubmit } = useForm<UpsertEmbedInput>({
    defaultValues: {
      name: embed?.name,
      description: embed?.description,
    },
  });
  const onSubmit = (data: UpsertEmbedInput) => {
    upsertEmbed.mutate(
      {
        input: {
          ...data,
          id: embed?.id,
          populistUrl: "https://populist.us",
          organizationId: user.organizationId as string,
          attributes: {},
        },
      },
      {
        onSuccess: (data) => {
          toast("Embed saved!", { type: "success", position: "bottom-right" });
          void router.push(
            `/dashboard/${slug}/embeds/${data.upsertEmbed.id}`,
            undefined,
            {
              shallow: true,
            }
          );
        },
      }
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
