import { QueryClient, dehydrate, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  FlagSection,
  Layout,
  LoaderFlag,
  PartyAvatar,
  TextInput,
  SearchInput,
  Badge,
  Box,
  RadioGroup,
} from "components";
import {
  PoliticianBasicInfoQuery,
  PoliticianResult,
  SystemRoleType,
  usePoliticalPartiesQuery,
  usePoliticianBasicInfoQuery,
  usePoliticianBySlugQuery,
  useUpdatePoliticianMutation,
} from "generated";
import { GetServerSideProps } from "next";
import nextI18nextConfig from "next-i18next.config";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import { OGParams } from "pages/api/og";
import { SupportedLocale } from "types/global";
import styles from "../PoliticianPage.module.scss";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useAuth } from "hooks/useAuth";
import states from "utils/states";
import { toast } from "react-toastify";
import { PERSON_FALLBACK_IMAGE_400_URL } from "utils/constants";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import { useEffect, useState } from "react";
import { OfficeResultsTable } from "components/OfficeResultsTable/OfficeResultsTable";

export function PoliticianBasicsForm({
  politician,
  hideDoneButton = false,
  hideSlug = false,
  hideBioSource = false,
  hideOfficialWebsite = false,
  hideRaceWinsLosses = false,
}: {
  politician: Partial<PoliticianResult>;
  hideDoneButton?: boolean;
  hideSlug?: boolean;
  hideBioSource?: boolean;
  hideOfficialWebsite?: boolean;
  hideRaceWinsLosses?: boolean;
}) {
  const { register, control, handleSubmit, formState, reset } = useForm<
    Partial<PoliticianResult>
  >({
    defaultValues: {
      ...politician,
    },
    mode: "onChange",
  });

  const isDirty = !!Object.keys(formState.dirtyFields).length;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdatePoliticianMutation();
  const { data: partyData, isLoading: partiesAreLoading } =
    usePoliticalPartiesQuery();

  const handleSave = (formData: Partial<PoliticianResult>) => {
    return mutate(
      {
        intakeToken: (router.query.token as string) || "",
        slug: politician.slug as string,
        input: {
          id: politician.id,
          slug: formData.slug,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          suffix: formData.suffix,
          preferredName: formData.preferredName,
          dateOfBirth: formData.dateOfBirth,
          homeState: formData.homeState,
          partyId: formData.partyId,
          biography: formData.biography,
          biographySource: formData.biographySource,
          officialWebsiteUrl: formData.officialWebsiteUrl,
          campaignWebsiteUrl: formData.campaignWebsiteUrl,
          facebookUrl: formData.facebookUrl,
          twitterUrl: formData.twitterUrl,
          instagramUrl: formData.instagramUrl,
          tiktokUrl: formData.tiktokUrl,
          youtubeUrl: formData.youtubeUrl,
          linkedinUrl: formData.linkedinUrl,
          phone: formData.phone,
          email: formData.email,
          // @ts-expect-error this is a string
          raceWins: parseInt(formData.raceWins),
          // @ts-expect-error this is a string
          raceLosses: parseInt(formData.raceLosses),
        },
      },
      {
        onSuccess: () => {
          void queryClient.invalidateQueries({
            queryKey: [
              usePoliticianBySlugQuery.getKey({
                slug: politician.slug as string,
              }),
            ],
          });
          reset(formData);
          toast.success("Record has been updated", {
            position: "bottom-right",
          });
        },
        onError: (error) => {
          // Specify the type of 'error' as 'any'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          toast.error((error as any).message, {
            position: "bottom-right",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className={styles.editForm}>
      <div className={styles.editForm3Cols}>
        <TextInput
          name={"firstName"}
          label="First Name"
          register={register}
          control={control}
        />
        <TextInput
          name={"middleName"}
          label="Middle Name"
          register={register}
          control={control}
        />
        <TextInput
          name={"lastName"}
          label="Last Name"
          register={register}
          control={control}
        />
        <TextInput
          name={"suffix"}
          label="Suffix"
          register={register}
          control={control}
        />
        <TextInput
          name={"preferredName"}
          label="Preferred Name"
          register={register}
          control={control}
        />
        <TextInput
          type="date"
          name={"dateOfBirth"}
          label="Date of Birth"
          register={register}
          control={control}
          helperText="Only age will be made public, not the full date of birth"
        />
        {!hideSlug && (
          <TextInput
            name={"slug"}
            label="Slug"
            register={register}
            control={control}
          />
        )}
      </div>

      <div className={styles.editForm2Cols}>
        <div className={clsx(styles.inputContainer, styles.large)}>
          <label htmlFor="homeState">State</label>
          <select
            required
            {...register("homeState", {
              required: "State is required",
            })}
          >
            <option value="">State</option>
            {Object.entries(states).map(([key, value]) => (
              <option key={key} value={key} label={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        {!partiesAreLoading && (
          <div className={clsx(styles.inputContainer, styles.large)}>
            <label htmlFor="partyId">Party</label>
            <select {...register("party.id")}>
              <option value="">Party</option>
              {partyData?.politicalParties.map(({ id, name }) => (
                <option key={id} value={id} label={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <TextInput
        // @ts-expect-error - not sure whats going on with this type breadth, blaming react-hook-form and graphql-codegen
        textarea
        size="large"
        style={{ height: "200px" }}
        name={"biography"}
        label="Biography"
        register={register}
        control={control}
      />
      {!hideBioSource && (
        <TextInput
          name={"biographySource"}
          label="Biography Source"
          register={register}
          control={control}
        />
      )}
      <div className={styles.editForm2Cols}>
        {!hideOfficialWebsite && (
          <TextInput
            name={"officialWebsiteUrl"}
            label="Official Website Url"
            register={register}
            control={control}
          />
        )}
        <TextInput
          name={"campaignWebsiteUrl"}
          label="Campaign Website Url"
          register={register}
          control={control}
        />
        <TextInput
          name={"facebookUrl"}
          label="Facebook Url"
          register={register}
          control={control}
        />
        <TextInput
          name={"twitterUrl"}
          label="Twitter Url"
          register={register}
          control={control}
        />
        <TextInput
          name={"instagramUrl"}
          label="Instagram Url"
          register={register}
          control={control}
        />
        <TextInput
          name={"tiktokUrl"}
          label="TikTok Url"
          register={register}
          control={control}
        />
        <TextInput
          name={"youtubeUrl"}
          label="YouTube Url"
          register={register}
          control={control}
        />
        <TextInput
          name={"linkedinUrl"}
          label="LinkedIn Url"
          register={register}
          control={control}
        />
      </div>
      <div className={styles.editForm2Cols}>
        <TextInput
          name={"phone"}
          label="Phone"
          register={register}
          control={control}
        />
        <TextInput
          name={"email"}
          label="Email"
          register={register}
          control={control}
        />
      </div>
      {!hideRaceWinsLosses && (
        <div className={styles.editForm2Cols}>
          <TextInput
            type="number"
            name={"raceWins"}
            label="Race Wins"
            register={register}
            control={control}
          />
          <TextInput
            type="number"
            name={"raceLosses"}
            label="Race Losses"
            register={register}
            control={control}
          />
        </div>
      )}
      <div className={clsx(styles.flexBaseline)}>
        <Button
          type="submit"
          variant="primary"
          label="Save"
          size="large"
          disabled={!isDirty || isPending}
        />
        {!hideDoneButton && (
          <Button
            type="button"
            variant="secondary"
            label="Done"
            size="large"
            onClick={() => router.push(`/politicians/${politician.slug}`)}
          />
        )}
      </div>
    </form>
  );
}

function PoliticianAPILinksForm({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const { register, control, handleSubmit, formState, reset } = useForm<
    Partial<PoliticianResult>
  >({
    defaultValues: {
      votesmartCandidateId: politician.votesmartCandidateId,
      crpCandidateId: politician.crpCandidateId,
      fecCandidateId: politician.fecCandidateId,
      legiscanPeopleId: politician.legiscanPeopleId,
    },
    mode: "onChange",
  });

  const isDirty = !!Object.keys(formState.dirtyFields).length;
  const formErrors = formState.errors;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdatePoliticianMutation();

  const handleSave = (formData: Partial<PoliticianResult>) => {
    return mutate(
      {
        intakeToken: router.query.token as string,
        slug: politician.slug as string,
        input: {
          id: politician.id,
          votesmartCandidateId: formData.votesmartCandidateId,
          crpCandidateId: formData.crpCandidateId,
          fecCandidateId: formData.fecCandidateId,
          legiscanPeopleId: formData.legiscanPeopleId,
        },
      },
      {
        onSettled: (data) => {
          if (!data?.updatePolitician) return;
          // @ts-expect-error - not sure whats going on with this type breadth
          if (data.errors) {
            // @ts-expect-error - ""
            data.errors.forEach((error) => {
              toast.error(error.message, {
                position: "bottom-right",
              });
            });
          }
          void queryClient.invalidateQueries({
            queryKey: usePoliticianBySlugQuery.getKey({
              slug: politician.slug as string,
            }),
          });
          if (data.updatePolitician)
            toast.success("Record has been updated", {
              position: "bottom-right",
            });
          reset(formData);
        },
        onError: (error) => {
          toast.error(JSON.stringify(error), {
            position: "bottom-right",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className={styles.editForm}>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          width: "100%",
        }}
      >
        <TextInput
          name={"votesmartCandidateId"}
          label="VoteSmart Candidate ID"
          register={register}
          control={control}
          rules={{
            pattern: {
              value: /^[0-9]*$/,
              message: "Only numbers are allowed",
            },
          }}
          errors={formErrors.votesmartCandidateId?.message}
        />
        <TextInput
          name={"crpCandidateId"}
          label="CRP Candidate ID"
          register={register}
          control={control}
          errors={formErrors.crpCandidateId?.message}
        />
        <TextInput
          name={"fecCandidateId"}
          label="FEC Candidate ID"
          register={register}
          control={control}
          errors={formErrors.fecCandidateId?.message}
        />
        <TextInput
          name={"legiscanPeopleId"}
          label="LegiScan People ID"
          register={register}
          control={control}
          errors={formErrors.legiscanPeopleId?.message}
        />
      </div>
      <div className={clsx(styles.flexBaseline)}>
        <Button
          type="submit"
          variant="primary"
          label="Save"
          size="large"
          disabled={!isDirty || isPending}
        />
        <Button
          type="button"
          variant="secondary"
          label="Done"
          size="large"
          onClick={() => router.push(`/politicians/${politician.slug}`)}
        />
      </div>
    </form>
  );
}

export function PoliticianAvatar({
  politician,
  hideName = false,
}: {
  politician: Partial<PoliticianResult>;
  hideName?: boolean;
}) {
  const [uploading, setUploading] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { query } = useRouter();
  const intakeToken = query.token as string;

  const [avatarUrl, setAvatarUrl] = useState(
    () =>
      politician?.assets?.thumbnailImage400 ||
      politician?.thumbnailImageUrl ||
      politician?.votesmartCandidateBio?.candidate.photo
  );

  const onDropAccepted = (files: FileWithPath[]) => {
    setUploading(true);
    const formData = new FormData();
    const uploadAvatarPictureOperations = `
      {
        "query":"mutation UploadPoliticianPicture($slug: String, $intakeToken: String, $file: Upload) {uploadPoliticianPicture(slug: $slug, intakeToken: $intakeToken, file: $file) }",
        "variables":{
            "slug": "${politician.slug}",
            "intakeToken": "${intakeToken || ""}",
            "file": null
        }
      }
      `;

    formData.append("operations", uploadAvatarPictureOperations);
    const map = `{"file": ["variables.file"]}`;
    formData.append("map", map);
    if (files[0]) formData.append("file", files[0]);

    fetch(`${process.env.GRAPHQL_SCHEMA_PATH}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then(async (data) => {
        queryClient
          .invalidateQueries({
            queryKey: usePoliticianBySlugQuery.getKey({
              slug: politician.slug as string,
            }),
          })
          .catch((err) =>
            toast.error(err, {
              position: "bottom-right",
            })
          );
        const json = await data.json();
        setAvatarUrl(json.data.uploadPoliticianPicture);
      })
      .catch((error) =>
        toast.error(error, {
          position: "bottom-right",
        })
      )
      .finally(() => setUploading(false));
  };

  const onDropRejected = (e: FileRejection[]) => {
    e.forEach((file) => {
      toast.error(file.errors[0]?.message);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    multiple: false,
    maxSize: 2 * 1024 * 1024,
  });

  const label = isDragActive
    ? "Drop image here"
    : !avatarUrl
      ? "Upload profile picture"
      : "Change profile picture";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {uploading ? (
        <LoaderFlag />
      ) : (
        <PartyAvatar
          key={politician?.id}
          badgeSize={"3.125rem"}
          badgeFontSize={"2rem"}
          borderWidth="6px"
          size={200}
          party={politician?.party}
          src={avatarUrl as string}
          fallbackSrc={PERSON_FALLBACK_IMAGE_400_URL}
          alt={politician?.fullName as string}
          hasIconMenu={true}
        />
      )}
      <div {...getRootProps()} style={{ marginTop: "2rem" }}>
        <input {...getInputProps()} />
        <Button variant="secondary" size="large" theme="blue" label={label} />
      </div>
      {!hideName && <h1 className={styles.fullName}>{politician?.fullName}</h1>}
    </div>
  );
}

function PoliticianOffices({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const router = useRouter();
  const currentOffice = politician.currentOffice;
  const updatePolitician = useUpdatePoliticianMutation();
  const handleRemoveOffice = (_officeId: string) => {
    confirm(
      "Are you sure you want to remove this politician's current office?"
    ) &&
      updatePolitician.mutate({
        intakeToken: router.query.token as string,
        slug: politician.slug as string,
        input: {
          id: politician.id,
          officeId: "SET_NULL",
        },
      });
  };

  const [searchValue, setSearchValue] = useState<string>("");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "1fr auto",
        gap: "1.5rem",
      }}
    >
      <div>
        <h4>Current Office</h4>
        <Box>
          {currentOffice ? (
            <Badge
              dismissible
              onDismiss={() => handleRemoveOffice(currentOffice.id as string)}
            >
              {currentOffice.title} - {currentOffice.subtitle}
            </Badge>
          ) : (
            <p className={styles.noResults}>NO OFFICES</p>
          )}
        </Box>
      </div>
      <div>
        <h4>Former Offices</h4>
        <Box>
          <p className={styles.noResults}>NOT YET IMPLEMENTED</p>{" "}
        </Box>
      </div>
      <div style={{ gridColumn: "1/3" }}>
        <h2>Search Offices</h2>
        <Box>
          <SearchInput
            placeholder="Search for offices"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />{" "}
        </Box>
        <OfficeResultsTable />
      </div>
    </div>
  );
}

export default function PoliticianEditPage({
  slug,
  mobileNavTitle,
}: {
  slug: string;
  votingGuideId?: string;
  mobileNavTitle?: string;
  referer?: string;
  ogParams: OGParams;
}) {
  useAuth({ minRole: SystemRoleType.Staff, redirectTo: `/politician/${slug}` });

  const { data, isLoading } = usePoliticianBySlugQuery({
    slug: slug as string,
  });

  const politician = data?.politicianBySlug as Partial<PoliticianResult>;

  const router = useRouter();
  const { query } = router;
  const tabs = ["Basic Info", "Offices", "Endorsements", "API Links"];
  const [tab, setTab] = useState<string>((query.tab as string) || "Basic Info");

  useEffect(() => {
    void router.push(`/politicians/${slug}/edit?tab=${tab}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  if (isLoading) return <LoaderFlag />;

  return (
    <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile={true}>
      <div className={styles.container} style={{ marginTop: "4rem" }}>
        <PoliticianAvatar politician={politician} />
        <RadioGroup options={tabs} selected={tab} onChange={setTab} />
        <FlagSection label="Edit" style={{ width: "100%", marginTop: "3rem" }}>
          {tab === "Basic Info" && (
            <PoliticianBasicsForm politician={politician} />
          )}
          {tab === "Offices" && <PoliticianOffices politician={politician} />}
          {tab === "Endorsements" && <div>Endorsements (coming soon)</div>}
          {tab === "API Links" && (
            <PoliticianAPILinksForm politician={politician} />
          )}
        </FlagSection>
      </div>
    </Layout>
  );
}

interface Params extends NextParsedUrlQuery {
  slug: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx;
  const { slug } = params as Params;
  const { votingGuideId = null } = ctx.query || {};
  const referer = ctx.req.headers?.referer || null;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: usePoliticianBasicInfoQuery.getKey({ slug }),
    queryFn: usePoliticianBasicInfoQuery.fetcher({ slug }),
  });
  const state = dehydrate(queryClient);

  const data = state.queries[0]?.state.data as PoliticianBasicInfoQuery;

  const ogParams: OGParams = {
    cardType: "politician",
    imageSrc: data?.politicianBySlug?.assets.thumbnailImage400 as string,
  };

  return {
    notFound: !data,
    props: {
      slug,
      referer,
      votingGuideId,
      dehydratedState: state,
      mobileNavTitle: data?.politicianBySlug?.fullName,
      title: data?.politicianBySlug?.fullName,
      description: `Check out ${data?.politicianBySlug?.fullName}'s voting record, financial data, and more on Populist.`,
      ogParams,
      ...(await serverSideTranslations(
        locale as SupportedLocale,
        ["auth", "common"],
        nextI18nextConfig
      )),
    },
  };
};
