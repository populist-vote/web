import { useQueryClient } from "@tanstack/react-query";
import { BillWidgetRenderOptions } from "components/BillWidget/BillWidget";
import { Checkbox } from "components/Checkbox/Checkbox";
import { PoliticianEmbedRenderOptions } from "components/PoliticianEmbed/PoliticianEmbed";
import { Select } from "components/Select/Select";
import { TextInput } from "components/TextInput/TextInput";
import {
  EmbedResult,
  EmbedType,
  UpsertEmbedInput,
  useEmbedByIdQuery,
  useOrganizationBySlugQuery,
  useUpsertEmbedMutation,
} from "generated";
import useOrganizationStore from "hooks/useOrganizationStore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SubmitHandler, UseFormRegister, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LANGUAGES } from "utils/constants";

type UpsertEmbedInputWithOptions = UpsertEmbedInput & {
  renderOptions: BillWidgetRenderOptions | PoliticianEmbedRenderOptions;
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

function MyBallotEmbedRenderOptionsForm({
  defaultLanguage,
  handleDefaultLanguageChange,
}: {
  defaultLanguage: string;
  handleDefaultLanguageChange: (embedType: EmbedType, value: string) => void;
}) {
  const availableLanguageCodes = ["en", "es"];
  const availableLanguages = LANGUAGES.filter(
    (lang) => availableLanguageCodes?.includes(lang.code) || lang.code === "en"
  );
  return (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <span>Default language</span>
      <Select
        backgroundColor="blue"
        value={defaultLanguage || "en"}
        options={availableLanguages.map((l) => ({
          value: l.code,
          label: l.display,
        }))}
        onChange={(e) =>
          handleDefaultLanguageChange(EmbedType.MyBallot, e.target.value)
        }
      />
    </div>
  );
}

function EmbedBasicsForm({ embed }: { embed: EmbedResult | null }) {
  const router = useRouter();
  const upsertEmbed = useUpsertEmbedMutation();
  const queryClient = useQueryClient();
  const dashboardSlug = router.query.dashboardSlug as string;

  const { data, isLoading } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug,
    },
    {
      enabled: !!dashboardSlug,
    }
  );

  const organizationId = data?.organizationBySlug?.id;

  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty },
    watch,
  } = useForm<UpsertEmbedInputWithOptions>({
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

  const onSubmit: SubmitHandler<UpsertEmbedInputWithOptions> = async (data) => {
    upsertEmbed.mutate(
      {
        input: {
          name: data.name,
          description: data.description,
          id: embed?.id,
          organizationId: organizationId as string,
          embedType: embed?.embedType,
          attributes: {
            ...embed?.attributes,
            renderOptions: data.renderOptions,
          },
        },
      },
      {
        onSuccess: () => {
          toast("Embed saved!", {
            type: "success",
            position: "bottom-right",
          });
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

  // Watch specific fields
  const name = watch("name");
  const description = watch("description");

  // Autosave logic with delay
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        void handleSubmit(onSubmit)(); // Submit form data after debounce
      }, 1000); // Auto-save delay (1 second after last change)

      return () => clearTimeout(timer); // Cleanup timer on unmount or if form changes
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, handleSubmit, name, description]);

  const { organizationId: currentOrganizationId } = useOrganizationStore();

  const handleDefaultLanguageChange = (
    embedType: EmbedType,
    language: string
  ) => {
    upsertEmbed.mutate(
      {
        input: {
          id: embed?.id,
          organizationId: currentOrganizationId as string,
          name: embed?.name,
          embedType,
          attributes: {
            ...embed?.attributes,
            renderOptions: {
              ...embed?.attributes?.renderOptions,
              defaultLanguage: language,
            },
          },
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["EmbedById", { id: embed?.id }],
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
      case EmbedType.MyBallot:
        return (
          <MyBallotEmbedRenderOptionsForm
            handleDefaultLanguageChange={handleDefaultLanguageChange}
            defaultLanguage={embed.attributes?.renderOptions?.defaultLanguage}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) return null;

  return (
    <form>
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
      </div>
      <div
        style={{
          width: "100%",
          height: "1px",
          borderTop: "1px solid var(--blue-dark)",
          margin: "1rem 0",
        }}
      />
      {renderOptions()}
    </form>
  );
}

export { EmbedBasicsForm };
