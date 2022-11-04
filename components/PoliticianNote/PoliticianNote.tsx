import { Candidate } from "components";
import { Language, LanguageNote } from "utils/constants";
import { PoliticianResult } from "generated";

interface PoliticianNoteProps {
  politician: Partial<PoliticianResult>;
  itemId: string;
  note: LanguageNote;
  language: Language;
}

const PoliticianNote = ({
  politician,
  itemId,
  note,
  language,
}: PoliticianNoteProps): JSX.Element => {
  return (
    <>
      <Candidate itemId={itemId} candidate={politician} />
      <p>{note[language] || "No Note"}</p>
    </>
  );
};

export { PoliticianNote };
