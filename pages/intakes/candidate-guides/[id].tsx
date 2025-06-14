import {
  Badge,
  BasicLayout,
  Box,
  Button,
  Divider,
  LoaderFlag,
  LogoText,
  TextInput,
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
} from "generated";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./CandidateGuideIntake.module.scss";
import { useForm } from "react-hook-form";
import states from "utils/states";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Race } from "components/Ballot/Race";
import { useQueryClient } from "@tanstack/react-query";
import {
  PoliticianAvatar,
  PoliticianBasicsForm,
} from "pages/politicians/[politicianSlug]/edit";

export default function CandidateGuideIntake() {
  const router = useRouter();
  const { id, token, raceId } = router.query;
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
  const { data: organizationData } = useOrganizationByIdQuery(
    {
      id: data?.candidateGuideById.organizationId as string,
    },
    {
      enabled: !!data?.candidateGuideById.organizationId,
    }
  );

  const organizationLogoUrl =
    organizationData?.organizationById?.assets?.bannerImage;

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

  const existingSubmissionsArray = useMemo(
    () =>
      questions
        ?.flatMap((question) => question.submissionsByCandidateId)
        .filter((submission) => submission && !!submission.response),
    [questions]
  );

  const existingSubmissionsHash = useMemo(
    () =>
      data?.candidateGuideById.questions?.reduce(
        (acc, question) => ({
          ...acc,
          [question.id]: question.submissionsByCandidateId[0]?.response ?? "",
        }),
        {}
      ),
    [data?.candidateGuideById.questions]
  );

  const { register, handleSubmit, setValue, getValues, control, formState } =
    useForm<Record<string, string>>({
      defaultValues: existingSubmissionsHash,
    });

  const [hasSubmitted, setHasSubmitted] = useState(
    !!existingSubmissionsArray?.length
  );
  const [isEditing, setIsEditing] = useState(!hasSubmitted);

  useEffect(() => {
    if (existingSubmissionsHash) {
      Object.entries(existingSubmissionsHash).forEach(
        ([questionId, response]) => {
          setValue(questionId, response as string);
        }
      );
    }

    if (!!existingSubmissionsArray?.length) {
      setHasSubmitted(true);
      setIsEditing(false);
    }
  }, [data, existingSubmissionsHash, existingSubmissionsArray, setValue]);

  const upsertSubmission = useUpsertQuestionSubmissionMutation();
  const queryClient = useQueryClient();

  const embedId = data?.candidateGuideById.embeds.find(
    (e) => e?.race?.id === raceId
  )?.id;

  const areSubmissionsClosed =
    data?.candidateGuideById.submissionsCloseAt !== null &&
    new Date(data?.candidateGuideById.submissionsCloseAt) < new Date();

  const onSubmit = (data: Record<string, string>) => {
    try {
      for (const [questionId, response] of Object.entries(data)) {
        const existingSubmissionId = questions?.find(
          (question) => question.id === questionId
        )?.submissionsByCandidateId[0]?.id;

        if (!response && !existingSubmissionId) continue;
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
            onSuccess: async () => {
              await queryClient.invalidateQueries({
                queryKey: ["CandidateGuideIntakeQuestions"],
              });
              setHasSubmitted(true);
              setIsEditing(false);
            },
            onError: (error) => {
              throw error;
            },
          }
        );
      }
    } catch (error) {
      toast(error as string);
    }
  };

  useEffect(() => {
    if (!hasSubmitted) {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [hasSubmitted]);

  if (isLoading || isPoliticianLoading || isRaceLoading)
    return (
      <div style={{ height: "100vh" }}>
        <LoaderFlag />
      </div>
    );

  if (!politician || !race) return <small>No politician data attached.</small>;

  return (
    <BasicLayout hideHeader hideFooter>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.introduction}>
          {organizationLogoUrl && (
            <Image
              src={organizationLogoUrl as string}
              alt="Organization Logo"
              height={100}
              width={400}
              style={{ objectFit: "contain" }}
            />
          )}
          <Divider />
          <h1>Hi {politician?.fullName},</h1>
          <p>
            {organizationData?.organizationById?.name} has partnered with
            Populist to help you share your thoughts on important issues facing{" "}
            {states[politician?.homeState as State]}. Please take a moment to
            fill out answers to the following questions created by the politics
            team at {organizationData?.organizationById?.name}. Your answers
            will be shared with the public.
          </p>
        </div>

        {!isEditing ? (
          <>
            <section className={styles.submissionConfirmedSection}>
              <Box>
                <div className={styles.submissionConfirmedMessage}>
                  <h2>Thank you for your submission!</h2>
                  <p>
                    Your responses have been submitted. If you have any
                    questions or concerns, please reach out to us at{" "}
                    <a
                      style={{ color: "var(--blue-text-light)" }}
                      href="mailto:info@populist.us"
                    >
                      info@populist.us
                    </a>
                    .
                  </p>
                </div>
              </Box>
            </section>

            {areSubmissionsClosed && (
              <section className={styles.submissionClosedSection}>
                <Box>
                  <div className={styles.submissionClosedMessage}>
                    <h2>Submissions are now closed.</h2>
                    {embedId && (
                      <Button
                        label="Preview Candidate Guide"
                        onClick={() =>
                          router.push(`/embeds/preview/${embedId}`)
                        }
                      />
                    )}
                  </div>
                </Box>
              </section>
            )}

            <section className={styles.submissionPreview}>
              <Divider />
              {questions?.map((question) => (
                <div key={question.id} className={styles.question}>
                  <h2>{question.prompt}</h2>
                  <p>{getValues(question.id)}</p>
                  {!areSubmissionsClosed && (
                    <Button
                      label="Edit Response"
                      size="large"
                      variant="primary"
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                </div>
              ))}
              <Divider />
            </section>
          </>
        ) : areSubmissionsClosed ? (
          <section className={styles.submissionClosedSection}>
            <Box>
              <div className={styles.submissionClosedMessage}>
                <h2>Submissions are now closed.</h2>
                {embedId && (
                  <Button
                    label="Preview Candidate Guide"
                    onClick={() => router.push(`/embeds/preview/${embedId}`)}
                  />
                )}
              </div>
            </Box>
            <Divider />
          </section>
        ) : (
          <section className={styles.questionsSection}>
            <Divider />
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
                gap: "1rem",
              }}
            >
              <Button
                label="Submit"
                size="large"
                variant="primary"
                disabled={!formState.isDirty || upsertSubmission.isPending}
              />
              {hasSubmitted && isEditing && (
                <Button
                  label="Cancel"
                  size="large"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                />
              )}
            </div>
            <Divider />
          </section>
        )}
      </form>

      <section className={styles.politicianAvatarUpload}>
        <Box>
          <h2>Edit Your Information</h2>

          <p>
            If the photo we have of you below is missing, or you're not happy
            with it, please upload one that clearly shows your face.
          </p>
          <PoliticianAvatar politician={politician} hideName />
          <p className={styles.uploadNote}>
            For best results upload a square image smaller than 2mb that is at
            least 400 x 400 pixels.
          </p>

          <PoliticianBasicsForm
            politician={politician}
            hideDoneButton
            hideSlug
            hideBioSource
            hideOfficialWebsite
            hideRaceWinsLosses
            onSave={() => handleSubmit(onSubmit)()}
          />
        </Box>
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
        <div className={styles.racePreviewContainer}>
          <div className={styles.flexBetween}>
            <div className={styles.officeHeader}>
              <h3 className={styles.officeName}>{race?.office.name}</h3>
              <Divider vertical height={"2.5rem"} />
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
            <div className={styles.raceContainer}>
              <Race race={race as RaceResult} theme="dark" itemId={race.id} />
            </div>
          </Box>
        </div>
      </section>
    </BasicLayout>
  );
}
