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
  useUpsertQuestionSubmissionMutation,
} from "generated";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./CandidateGuideIntake.module.scss";
import { useForm } from "react-hook-form";
import states from "utils/states";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Race } from "components/Ballot/Race";

export default function CandidateGuideIntake() {
  const { id, token } = useRouter().query;
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
  const politician = politicianData?.politicianByIntakeToken;
  const race = politician?.upcomingRace;
  const questions = data?.candidateGuideById.questions;

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const existingSubmissions = questions?.reduce(
    (acc, question) => ({
      ...acc,
      [question.id]: question.submissionsByCandidateId[0]?.response ?? "",
    }),
    {}
  );

  const { register, handleSubmit, setValue } = useForm<Record<string, string>>({
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

  if (isLoading || isPoliticianLoading) return <LoaderFlag />;

  if (!politician || !race) return <small>No politician data attached.</small>;

  return (
    <BasicLayout hideAuthButtons hideTextMenu>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Image
            alt="thumbnail"
            width={160}
            height={160}
            src={
              organizationData?.organizationById.assets
                .thumbnailImage160 as string
            }
          />
          <h1>Hi, {politician?.fullName}</h1>
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
          <section>
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
          </section>
        ) : (
          <section>
            {questions?.map((question) => (
              <div key={question.id}>
                <h2>{question.prompt}</h2>
                <TextInput
                  name={question.id}
                  textarea
                  register={register}
                  placeholder={question.responsePlaceholderText as string}
                  charLimit={question.responseCharLimit as number}
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
      <section>
        <div className={styles.branding}>
          <span className={styles.poweredBy}>Powered by</span>
          <LogoText />
        </div>
        <div>
          <div className={styles.flexBetween}>
            <div className={styles.flexEvenly}>
              <h3>{race?.office.name}</h3>
              <Divider vertical color="var(--grey-dark)" />
              <h3>{states[race?.state as State]}</h3>
            </div>
            <div className={styles.flexBetween}>
              <Badge size="small" theme="blue" variant="solid">
                {race.voteType}
              </Badge>
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
