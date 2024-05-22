import { BasicLayout, Button, Divider, TextInput } from "components";
import {
  State,
  useCandidateGuideByIdQuery,
  useOrganizationByIdQuery,
  usePoliticianByIntakeTokenQuery,
  useUpsertQuestionSubmissionMutation,
} from "generated";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./CandidateGuideIntake.module.scss";
import { useForm } from "react-hook-form";
import states from "utils/states";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CandidateGuideIntake() {
  const { id, token } = useRouter().query;
  const { data } = useCandidateGuideByIdQuery({
    id: id as string,
  });
  const { data: organizationData } = useOrganizationByIdQuery({
    id: data?.candidateGuideById.organizationId as string,
  });
  const { data: politicianData } = usePoliticianByIntakeTokenQuery({
    token: token as string,
  });
  const politician = politicianData?.politicianByIntakeToken;
  const questions = data?.candidateGuideById.questions;

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { register, handleSubmit } = useForm();

  const upsertSubmission = useUpsertQuestionSubmissionMutation();

  const onSubmit = (data: Record<string, string>) => {
    try {
      for (const [questionId, response] of Object.entries(data)) {
        upsertSubmission.mutate(
          {
            questionSubmissionInput: {
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

  if (!politician || !questions || !organizationData)
    return <small>Something went wrong.</small>;

  return (
    <BasicLayout>
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
                <TextInput name={question.id} textarea register={register} />
              </div>
            ))}
            <div
              style={{
                marginTop: "1rem",
              }}
            >
              <Button label="Submit" size="large" variant="primary" />
            </div>
          </section>
        )}
      </form>
    </BasicLayout>
  );
}
