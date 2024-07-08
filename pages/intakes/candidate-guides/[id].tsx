import {
  Badge,
  BasicLayout,
  Box,
  Button,
  Divider,
  LoaderFlag,
  LogoText,
  TextInput,
  PartyAvatar,
} from "components";
import {
  RaceResult,
  State,
  useCandidateGuideIntakeQuestionsQuery,
  useOrganizationByIdQuery,
  usePoliticianByIntakeTokenQuery,
  useRaceByIdQuery,
  useUpsertQuestionSubmissionMutation,
  VoteType,
  PoliticianResult,
  usePoliticianBySlugQuery,
} from "generated";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./CandidateGuideIntake.module.scss";
import { useForm } from "react-hook-form";
import states from "utils/states";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Race } from "components/Ballot/Race";
import clsx from "clsx";

import { useQueryClient } from "@tanstack/react-query";
import { FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import { PERSON_FALLBACK_IMAGE_400_URL } from "utils/constants";

function PoliticianAvatar({
  politician,
}: {
  politician: Partial<PoliticianResult>;
}) {
  const [uploading, setUploading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const avatarUrl = politician?.assets?.thumbnailImage400;

  const onDropAccepted = (files: FileWithPath[]) => {
    setUploading(true);
    const formData = new FormData();
    const uploadAvatarPictureOperations = `
      {
        "query":"mutation UploadPoliticianPicture($slug: String, $file: Upload) {uploadPoliticianPicture(slug: $slug, file: $file) }",
        "variables":{
            "slug": "${politician.slug}",
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
      .then(() => {
        queryClient
          .invalidateQueries({
            queryKey: usePoliticianBySlugQuery.getKey({
              slug: politician.slug as string,
            }),
          })
          .catch((err) => toast.error(err));
        document.location.reload();
      })
      .catch((error) => toast.error(error))
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
          src={
            (politician?.assets?.thumbnailImage400 ||
              politician?.thumbnailImageUrl ||
              politician?.votesmartCandidateBio?.candidate.photo) as string
          }
          fallbackSrc={PERSON_FALLBACK_IMAGE_400_URL}
          alt={politician?.fullName as string}
          hasIconMenu={true}
        />
      )}
      <div {...getRootProps()} style={{ marginTop: "2rem" }}>
        <input {...getInputProps()} />
        <Button variant="secondary" size="large" theme="blue" label={label} />
      </div>
      {/* <h1 className={styles.fullName}>{politician?.fullName}</h1> */}
    </div>
  );
}

export default function CandidateGuideIntake() {
  const { id, token, raceId } = useRouter().query;
  const { data: politicianData, isLoading: isPoliticianLoading } =
    usePoliticianByIntakeTokenQuery({
      token: token as string,
    });
  const { data, isLoading } = useCandidateGuideIntakeQuestionsQuery(
    {
      candidateGuideId: id as string,
      candidateId: politicianData?.politicianByIntakeToken?.id as string,
    },
    {
      enabled: !!politicianData?.politicianByIntakeToken?.id,
    }
  );
  const { data: organizationData } = useOrganizationByIdQuery({
    id: data?.candidateGuideById.organizationId as string,
  });

  const organizationLogoUrl =
    organizationData?.organizationById.assets.bannerImage;

  const { data: raceData, isLoading: isRaceLoading } = useRaceByIdQuery(
    {
      id: raceId as string,
    },
    {
      enabled: !!raceId,
    }
  );
  const politician =
    politicianData?.politicianByIntakeToken as PoliticianResult;
  const race = raceData ? raceData.raceById : politician?.upcomingRace;
  const questions = data?.candidateGuideById.questions;

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const existingSubmissions = questions?.reduce(
    (acc, question) => ({
      ...acc,
      [question.id]: question.submissionsByCandidateId[0]?.response ?? "",
    }),
    {}
  );

  const { register, handleSubmit, setValue, control } = useForm<
    Record<string, string>
  >({
    defaultValues: existingSubmissions,
  });

  useEffect(() => {
    if (existingSubmissions) {
      Object.entries(existingSubmissions).forEach(([questionId, response]) => {
        setValue(questionId, response as string);
      });
    }
  }, [existingSubmissions, setValue]);

  const upsertSubmission = useUpsertQuestionSubmissionMutation();

  const onSubmit = (data: Record<string, string>) => {
    try {
      for (const [questionId, response] of Object.entries(data)) {
        const existingSubmissionId = questions?.find(
          (question) => question.id === questionId
        )?.submissionsByCandidateId[0]?.id;
        upsertSubmission.mutate(
          {
            questionSubmissionInput: {
              id: existingSubmissionId,
              questionId,
              candidateId: politician?.id,
              response: response as string,
            },
          },
          {
            onError: (error) => {
              throw error;
            },
          }
        );
      }
    } catch (error) {
      toast(error as string);
    } finally {
      setHasSubmitted(true);
    }
  };

  if (isLoading || isPoliticianLoading || isRaceLoading) return <LoaderFlag />;

  if (!politician || !race) return <small>No politician data attached.</small>;

  return (
    <BasicLayout hideHeader hideFooter>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.introduction}>
          <Image
            src={organizationLogoUrl as string}
            alt="Organization Logo"
            height={100}
            width={300}
          />
          <Divider />
          <h1>Hi {politician?.fullName},</h1>
          <p>
            MPR News has partnered up with Populist to help you share your
            thoughts on important issues facing{" "}
            {states[politician?.homeState as State]}. Please take a moment to
            fill out answers to the following questions created by the politics
            team at MPR News. Your answers will be shared with the public.
          </p>
          <Divider />
        </div>
        {hasSubmitted ? (
          <section className={styles.submissionConfirmedSection}>
            <h2>Thank you for your submission!</h2>
            <p>
              Your responses have been submitted. If you have any questions or
              concerns, please reach out to us at{" "}
              <a
                style={{ color: "var(--blue-text-light)" }}
                href="mailto:info@populist.us"
              >
                info@populist.us
              </a>
              .
            </p>
            <Divider />
          </section>
        ) : (
          <section className={styles.questionsSection}>
            {questions?.map((question) => (
              <div key={question.id} className={styles.question}>
                <h2>{question.prompt}</h2>
                <TextInput
                  name={question.id}
                  textarea
                  register={register}
                  placeholder={question.responsePlaceholderText as string}
                  charLimit={question.responseCharLimit as number}
                  control={control}
                />
              </div>
            ))}
            <div
              style={{
                margin: "3rem 0",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button label="Submit" size="large" variant="primary" />
            </div>
            <Divider />
          </section>
        )}
      </form>

      <section className={styles.politicianAvatarUpload}>
        <h2>Your Profile Picture</h2>
        <p>
          We try to use up to date photos when possible, but if we don't have an
          image or you aren't happy with it, please upload a headshot of
          yourself so citizens can put a face to your name.
        </p>
        <PoliticianAvatar politician={politician} />
        <Divider />
      </section>

      <section className={styles.poweredBySection}>
        <div className={styles.branding}>
          <span className={styles.poweredBy}>Powered by</span>
          <LogoText />
        </div>
        <p>
          Populist is a non-partisan civic content platform built on election,
          politician, and legislation data.
        </p>
        <div className={styles.raceContainer}>
          <div className={styles.flexBetween}>
            <div className={clsx(styles.flexEvenly, styles.officeHeader)}>
              <h3 className={styles.officeName}>{race?.office.name}</h3>
              <h3 className={styles.officeSubtitle}>{race?.office.subtitle}</h3>
            </div>
            <div className={styles.flexBetween}>
              {race.voteType != VoteType.Plurality && (
                <Badge size="small" theme="blue" variant="solid">
                  {race.voteType}
                </Badge>
              )}
              {race.numElect && (
                <Badge size="small" theme="blue" variant="solid">
                  Elect {race.numElect}
                </Badge>
              )}
            </div>
          </div>
          <Box>
            <Race race={race as RaceResult} theme="dark" itemId={race.id} />
          </Box>
        </div>
      </section>
    </BasicLayout>
  );
}
