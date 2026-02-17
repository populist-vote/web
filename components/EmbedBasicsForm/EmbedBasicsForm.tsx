import { useQueryClient } from "@tanstack/react-query";
import { BillWidgetRenderOptions } from "components/BillWidget/BillWidget";
import { Button } from "components/Button/Button";
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
import {
  Control,
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { toast } from "react-toastify";
import { LANGUAGES } from "utils/constants";
import styles from "./EmbedBasicsForm.module.scss";

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
    <div className={styles.optionsContainer}>
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
  control,
  formStateErrors,
  defaultLanguage,
  handleDefaultLanguageChange,
  onSaveFixedHeight,
  isSaveHeightPending,
  isHeightDirty,
  organizationId,
}: {
  register: UseFormRegister<UpsertEmbedInputWithOptions>;
  control: Control<UpsertEmbedInputWithOptions>;
  formStateErrors: FieldErrors<UpsertEmbedInputWithOptions>;
  defaultLanguage: string;
  handleDefaultLanguageChange: (embedType: EmbedType, value: string) => void;
  onSaveFixedHeight: () => void;
  isSaveHeightPending: boolean;
  isHeightDirty: boolean;
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
    <div className={styles.optionsContainer}>
      <div className={styles.fixedHeightOptionContainer}>
        <div className={styles.divider} />
        <div className={styles.fixedHeightOption}>
          <span style={{ width: "16rem" }}>Fixed height (px)</span>
          <TextInput
            hideLabel
            register={register}
            control={control}
            name="renderOptions.height"
            size="small"
            rules={{
              pattern: {
                value:
                  /^$|^[aA]uto$|^(600|6[0-9]{2}|7[0-9]{2}|8[0-9]{2}|9[0-9]{2}|1[0-4][0-9]{2}|1500)$/,
                message: "Enter a value between 600 and 1500, or Auto",
              },
            }}
            errors={
              (
                formStateErrors?.renderOptions as
                  | { height?: { message?: string } }
                  | undefined
              )?.height?.message
            }
            useToastError
          />
          <Button
            variant="primary"
            onClick={onSaveFixedHeight}
            label="Save"
            size="medium"
            disabled={isSaveHeightPending || !isHeightDirty}
          />
        </div>
        <div className={styles.divider} />
      </div>
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
    getValues,
    setValue,
    formState: { isDirty, errors },
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
        height:
          embed?.attributes?.renderOptions?.height ??
          ("Auto" as unknown as number),
        isEndorserVariant: !!embed?.attributes?.endorserId,
      },
    },
  });

  const parseHeightValue = (
    h: string | number | undefined
  ): number | undefined => {
    if (h == null) return undefined;
    const s = String(h).trim();
    if (s === "" || s.toLowerCase() === "auto") return undefined;
    const n = Number(h);
    return !Number.isNaN(n) && n >= 600 && n <= 1500 ? n : undefined;
  };

  const onSubmit: SubmitHandler<UpsertEmbedInputWithOptions> = async (data) => {
    const renderOptions =
      embed?.embedType === EmbedType.MyBallot
        ? (() => {
            const h = (data.renderOptions as MyBallotEmbedRenderOptions).height;
            return {
              ...data.renderOptions,
              height: parseHeightValue(h as string | number | undefined),
            };
          })()
        : data.renderOptions;

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
            renderOptions,
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
  const height = watch("renderOptions.height");

  // Track previous values to detect what changed
  const prevName = useRef(name);
  const prevDescription = useRef(description);
  const prevIsEndorserVariant = useRef(isEndorserVariant);
  const prevHeight = useRef(height);

  // Normalize height for comparison (form may have "Auto", "800", saved is number)
  const normalizedHeight = (val: unknown): number | null => {
    if (val === "" || val === undefined || val === null) return null;
    const s = String(val).trim();
    if (s === "" || s.toLowerCase() === "auto") return null;
    const n = Number(val);
    return Number.isNaN(n) ? null : n;
  };

  const isHeightDirty =
    normalizedHeight(height) !==
    normalizedHeight(embed?.attributes?.renderOptions?.height);

  const handleSaveFixedHeight = () => {
    const raw = getValues("renderOptions.height");
    const heightValue = parseHeightValue(raw as string | number | undefined);
    upsertEmbed.mutate(
      {
        input: {
          id: embed?.id,
          organizationId: organizationId as string,
          name: embed?.name,
          embedType: embed?.embedType,
          attributes: {
            ...embed?.attributes,
            renderOptions: {
              ...embed?.attributes?.renderOptions,
              height: heightValue,
            },
          },
        },
      },
      {
        onSuccess: () => {
          if (heightValue == null) {
            setValue("renderOptions.height", "Auto" as unknown as number, {
              shouldDirty: false,
            });
          }
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

  // Autosave logic with delay (excludes endorser variant and fixed height; those have their own save)
  useEffect(() => {
    if (isDirty) {
      const isEndorserVariantChange =
        prevIsEndorserVariant.current !== isEndorserVariant;
      const isHeightChange = prevHeight.current !== height;
      // Skip autosave when only endorser variant or only height changed
      const onlyHeightOrEndorserChanged =
        (isHeightChange &&
          prevName.current === name &&
          prevDescription.current === description &&
          prevIsEndorserVariant.current === isEndorserVariant) ||
        isEndorserVariantChange;

      if (!onlyHeightOrEndorserChanged) {
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
    prevHeight.current = height;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, handleSubmit, name, description, isEndorserVariant, height]);

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
            control={control}
            formStateErrors={errors}
            handleDefaultLanguageChange={handleDefaultLanguageChange}
            onSaveFixedHeight={handleSaveFixedHeight}
            isSaveHeightPending={upsertEmbed.isPending}
            isHeightDirty={isHeightDirty}
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
      <div className={styles.optionsContainer}>
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
      {renderOptions()}
    </form>
  );
}

export { EmbedBasicsForm };
