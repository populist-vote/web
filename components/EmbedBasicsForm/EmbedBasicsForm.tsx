import { useQueryClient } from "@tanstack/react-query";
import { BillWidgetRenderOptions } from "components/BillWidget/BillWidget";
import { Checkbox } from "components/Checkbox/Checkbox";
import { MyBallotEmbedRenderOptions } from "components/MyBallotEmbed/MyBallotEmbed";
import { PoliticianEmbedRenderOptions } from "components/PoliticianEmbed/PoliticianEmbed";
import { Select } from "components/Select/Select";
import { TextInput } from "components/TextInput/TextInput";
import {
  EmbedResult,
  EmbedType,
  OrganizationRoleType,
  SystemRoleType,
  UpsertEmbedInput,
  useEmbedByIdQuery,
  useOrganizationBySlugQuery,
  useUpsertEmbedMutation,
} from "generated";
import { useAuth } from "hooks/useAuth";
import useOrganizationStore from "hooks/useOrganizationStore";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { SubmitHandler, UseFormRegister, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LANGUAGES } from "utils/constants";

type UpsertEmbedInputWithOptions = UpsertEmbedInput & {
  renderOptions:
    | BillWidgetRenderOptions
    | PoliticianEmbedRenderOptions
    | MyBallotEmbedRenderOptions;
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
  register,
  defaultLanguage,
  handleDefaultLanguageChange,
  organizationId,
}: {
  register: UseFormRegister<UpsertEmbedInputWithOptions>;
  defaultLanguage: string;
  handleDefaultLanguageChange: (embedType: EmbedType, value: string) => void;
  organizationId?: string;
}) {
  const { user } = useAuth();

  // Check if user is system admin OR organization admin/owner
  const isSystemAdmin =
    user?.systemRole === SystemRoleType.Staff ||
    user?.systemRole === SystemRoleType.Superuser;
  const isOrgAdmin =
    organizationId &&
    user?.organizations.some(
      (org) =>
        org.organizationId === organizationId &&
        (org.role === OrganizationRoleType.Admin ||
          org.role === OrganizationRoleType.Owner)
    );
  const isAdmin = isSystemAdmin || isOrgAdmin;

  const availableLanguageCodes = LANGUAGES.map((lang) => lang.code);
  const availableLanguages = LANGUAGES.filter(
    (lang) => availableLanguageCodes?.includes(lang.code) || lang.code === "en"
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Checkbox
        id="isEndorserVariant"
        name="renderOptions.isEndorserVariant"
        label={
          isAdmin
            ? "Only show endorsed candidates"
            : "Only show endorsed candidates (Admin only)"
        }
        register={register}
        disabled={!isAdmin}
      />
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
    </div>
  );
}

function EmbedBasicsForm({ embed }: { embed: EmbedResult | null }) {
  const router = useRouter();
  const upsertEmbed = useUpsertEmbedMutation();
  const queryClient = useQueryClient();
  const dashboardSlug = router.query.dashboardSlug as string;
  const { user } = useAuth();

  const { data, isLoading } = useOrganizationBySlugQuery(
    {
      slug: dashboardSlug,
    },
    {
      enabled: !!dashboardSlug,
    }
  );

  const organizationId = data?.organizationBySlug?.id;

  // Check if user is system admin OR organization admin/owner
  const isSystemAdmin =
    user?.systemRole === SystemRoleType.Staff ||
    user?.systemRole === SystemRoleType.Superuser;
  const isOrgAdmin =
    organizationId &&
    user?.organizations.some(
      (org) =>
        org.organizationId === organizationId &&
        (org.role === OrganizationRoleType.Admin ||
          org.role === OrganizationRoleType.Owner)
    );
  const isAdmin = isSystemAdmin || isOrgAdmin;

  // Track initial endorser variant value to prevent initial save
  const initialEndorserVariant = useRef<boolean | undefined>(undefined);

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
        defaultLanguage: embed?.attributes?.renderOptions?.defaultLanguage,
        isEndorserVariant: !!embed?.attributes?.endorserId,
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
            endorserId:
              isAdmin &&
              embed?.embedType === EmbedType.MyBallot &&
              (data.renderOptions as MyBallotEmbedRenderOptions)
                .isEndorserVariant
                ? organizationId
                : null,
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
  const isEndorserVariant = watch("renderOptions.isEndorserVariant");

  // Track previous values to detect what changed
  const prevName = useRef(name);
  const prevDescription = useRef(description);
  const prevIsEndorserVariant = useRef(isEndorserVariant);

  // Autosave logic with delay (excludes endorser variant changes which have immediate save)
  useEffect(() => {
    if (isDirty) {
      // Check if the change was to endorser variant - if so, skip autosave
      const isEndorserVariantChange =
        prevIsEndorserVariant.current !== isEndorserVariant;

      if (!isEndorserVariantChange) {
        const timer = setTimeout(() => {
          void handleSubmit(onSubmit)(); // Submit form data after debounce
        }, 1000); // Auto-save delay (1 second after last change)

        return () => clearTimeout(timer); // Cleanup timer on unmount or if form changes
      }
    }

    // Update previous values
    prevName.current = name;
    prevDescription.current = description;
    prevIsEndorserVariant.current = isEndorserVariant;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, handleSubmit, name, description, isEndorserVariant]);

  // Immediate save for endorser variant changes (no delay for better UX)
  useEffect(() => {
    // Skip if this is the first time we're setting the value (initial render)
    if (initialEndorserVariant.current === undefined) {
      initialEndorserVariant.current = isEndorserVariant;
      return;
    }

    // Skip if the value hasn't actually changed
    if (initialEndorserVariant.current === isEndorserVariant) {
      return;
    }

    // Update the initial value for next comparison
    initialEndorserVariant.current = isEndorserVariant;

    // Only save if user is admin, we have a valid embed, it's a MyBallot type
    if (
      isAdmin &&
      embed?.embedType === EmbedType.MyBallot &&
      embed?.id &&
      organizationId
    ) {
      void handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEndorserVariant]);

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
            register={register}
            handleDefaultLanguageChange={handleDefaultLanguageChange}
            defaultLanguage={embed?.attributes?.renderOptions?.defaultLanguage}
            organizationId={organizationId}
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
