import { QueryClient, dehydrate, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  FlagSection,
  HeaderSection,
  Layout,
  LoaderFlag,
  TextInput,
} from "components";
import {
  PoliticianBasicInfoQuery,
  PoliticianResult,
  Role,
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

function PoliticianForm({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const { register, handleSubmit, formState, reset } = useForm<
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
        input: {
          id: politician.id,
          slug: formData.slug,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          suffix: formData.suffix,
          preferredName: formData.preferredName,
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
          raceWins: formData.raceWins,
          raceLosses: formData.raceLosses,
        },
      },
      {
        onSettled: (data) => {
          queryClient.setQueryData(
            usePoliticianBySlugQuery.getKey({
              slug: politician.slug as string,
            }),
            { politicianBySlug: data?.upsertPolitician }
          );
          toast.success("Politician updated", {
            position: "bottom-right",
          });
          reset();
        },
        onError: (error) => {
          // Specify the type of 'error' as 'any'
          alert(JSON.stringify(error));
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className={styles.editForm}>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto auto",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
        }}
      >
        <TextInput name={"firstName"} label="First Name" register={register} />
        <TextInput
          name={"middleName"}
          label="Middle Name"
          register={register}
        />
        <TextInput name={"lastName"} label="Last Name" register={register} />
        <TextInput name={"suffix"} label="Suffix" register={register} />
        <TextInput
          name={"preferredName"}
          label="Preferred Name"
          register={register}
        />
        <TextInput name={"slug"} label="Slug" register={register} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          width: "100%",
        }}
      >
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
      />
      <TextInput
        name={"biographySource"}
        label="Biography Source"
        register={register}
      />
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr 1fr",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          width: "100%",
        }}
      >
        <TextInput
          name={"officialWebsiteUrl"}
          label="Official Website Url"
          register={register}
        />
        <TextInput
          name={"campaignWebsiteUrl"}
          label="Campaign Website Url"
          register={register}
        />
        <TextInput
          name={"facebookUrl"}
          label="Facebook Url"
          register={register}
        />
        <TextInput
          name={"twitterUrl"}
          label="Twitter Url"
          register={register}
        />
        <TextInput
          name={"instagramUrl"}
          label="Instagram Url"
          register={register}
        />
        <TextInput name={"tiktokUrl"} label="TikTok Url" register={register} />
        <TextInput
          name={"youtubeUrl"}
          label="YouTube Url"
          register={register}
        />
        <TextInput
          name={"linkedinUrl"}
          label="LinkedIn Url"
          register={register}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          width: "100%",
        }}
      >
        <TextInput name={"phone"} label="Phone" register={register} />
        <TextInput name={"email"} label="Email" register={register} />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "1fr",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          width: "100%",
        }}
      >
        <TextInput name={"raceWins"} label="Race Wins" register={register} />
        <TextInput
          name={"raceLosses"}
          label="Race Losses"
          register={register}
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
  useAuth({ minRole: Role.Staff });

  const { data, isLoading } = usePoliticianBySlugQuery({
    slug: slug as string,
  });

  const politician = data?.politicianBySlug as Partial<PoliticianResult>;

  if (isLoading) return <LoaderFlag />;

  return (
    <Layout mobileNavTitle={mobileNavTitle} showNavLogoOnMobile={true}>
      <div className={styles.container}>
        <HeaderSection basicInfo={{ ...politician }} />
        <FlagSection label="Edit">
          <PoliticianForm politician={politician} />
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
