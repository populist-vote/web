import { WidgetFooter } from "components/WidgetFooter/WidgetFooter";
import styles from "./QuestionWidget.module.scss";
import { TextInput } from "components/TextInput/TextInput";
import { useEmbedResizer } from "hooks/useEmbedResizer";
import { useEmbedByIdQuery } from "generated";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { Button } from "components/Button/Button";
import { useForm } from "react-hook-form";

export function QuestionWidget({
  embedId,
  origin,
}: {
  embedId: string;
  origin: string;
}) {
  useEmbedResizer({ origin, embedId });
  const { data, isLoading, error } = useEmbedByIdQuery({ id: embedId });
  const { register, watch } = useForm();

  if (isLoading) return <LoaderFlag />;
  if (error) return <div>Something went wrong loading this question.</div>;

  const prompt = data?.embedById?.question?.prompt;
  const placeholder =
    data?.embedById?.question?.responsePlaceholderText ||
    "Enter your response here";
  const charLimit = data?.embedById?.question?.responseCharLimit || undefined;

  return (
    <article className={styles.widgetContainer}>
      <main>
        <h3>{prompt}</h3>
        <form>
          <TextInput
            size="small"
            name="response"
            placeholder={placeholder}
            textarea
            charLimit={charLimit}
            register={register}
            watch={watch("response")}
          />
          <div className={styles.formFooter}>
            <Button size="small" variant="primary" label="Next" type="submit" />
          </div>
        </form>
      </main>
      <WidgetFooter />
    </article>
  );
}
