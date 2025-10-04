import { Candidate } from "components";
import { Language, LocalizedNote } from "utils/constants";
import { PoliticianResult } from "generated";

interface PoliticianNoteProps {
  politician: Partial<PoliticianResult>;
  itemId: string;
  note: LocalizedNote;
  language: Language;
}

const PoliticianNote = ({
  politician,
  itemId,
  note,
  language,
}: PoliticianNoteProps) => {
  return (
    <>
      <Candidate itemId={itemId} candidate={politician} />
      <p>{note[language as keyof typeof note] || "No Note"}</p>
    </>
  );
};

export { PoliticianNote };
