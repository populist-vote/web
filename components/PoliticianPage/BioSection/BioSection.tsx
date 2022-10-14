import { Button } from "components/Button/Button";
import { ColoredSection } from "components/ColoredSection/ColoredSection";
import ReactMarkdown from "react-markdown";
import styles from "./BioSection.module.scss";

function BioSection({
  biography,
  biographySource,
}: {
  biography: string;
  biographySource: string;
}) {
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
