import { Button } from "components/Button/Button";
import { ColoredSection } from "components/ColoredSection/ColoredSection";
import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { usePoliticianBioQuery } from "graphql-codegen/generated";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import styles from "./BioSection.module.scss";

function BioSection() {
  const { query } = useRouter();
  const { data, isLoading } = usePoliticianBioQuery({
    slug: query.slug as string,
  });
  const { biography, biographySource } = data?.politicianBySlug || {};
  if (isLoading) return <LoaderFlag />;
  if (!biography) return null;
  return (
    <ColoredSection color="var(--blue-dark)">
      <h2 className={styles.gradientHeader}>Biography</h2>

      <div className={styles.bioContent}>
        <ReactMarkdown>{biography}</ReactMarkdown>
      </div>

      {biographySource && (
        <a href={biographySource as string} target="_blank" rel="noreferrer">
          <Button variant="secondary" size="medium" label="Source"></Button>
        </a>
      )}
    </ColoredSection>
  );
}

export { BioSection };
