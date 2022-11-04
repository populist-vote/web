import { LoaderFlag } from "components/LoaderFlag/LoaderFlag";
import { Candidate } from "components/PoliticianPage/ElectionInfo/ElectionInfoSection";
import { Select } from "components/Select/Select";
import {
  PoliticianResult,
  useElectionBySlugQuery,
  useOrganizationPoliticianNotesQuery,
} from "generated";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  DEFAULT_LANGUAGE,
  Language,
  LocalizedNote,
  LANGUAGES,
} from "utils/constants";
import styles from "./PoliticianNotes.module.scss";

interface PoliticianNoteProps {
  politician: Partial<PoliticianResult>;
  notes: LocalizedNote;
  language: Language;
}

function PoliticianNote({ politician, notes, language }: PoliticianNoteProps) {
  return (
    <div className={styles.noteContainer}>
      <Candidate itemId={politician.slug as string} candidate={politician} />
      <div>
        <ReactMarkdown>
          {notes[language as keyof typeof notes] || ""}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function PoliticianNotes() {
  const electionQuery = useElectionBySlugQuery({
    slug: "general-election-2022",
  });
  const electionId = electionQuery.data?.electionBySlug.id as string;
  const { query } = useRouter();
  const slug = query.slug as string;
  const notesQuery = useOrganizationPoliticianNotesQuery(
    { slug, electionId },
    { enabled: !!electionId }
  );

  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const notes = useMemo(
    () => notesQuery.data?.organizationBySlug.politicianNotes || [],
    [notesQuery]
  );

  const uniqueOffices = useMemo(
    () =>
      notes
        .flatMap((note) => note?.politician?.upcomingRace?.office)
        .filter(
          (value, index, self) =>
            index === self.findIndex((o) => o?.slug === value?.slug)
        ),
    [notes]
  );

  const [selectedOfficeSlug, setSelectedOfficeSlug] = useState<string>(
    uniqueOffices[0]?.slug as string
  );

  const uniqueIssueTags = useMemo(
    () =>
      notes
        .flatMap((note) => note.issueTags)
        .filter(
          (value, index, self) =>
            index === self.findIndex((t) => t.slug === value.slug)
        ),
    [notes]
  );

  const [selectedIssueSlug, setSelectedIssueSlug] = useState<string>(
    uniqueIssueTags[0]?.slug as string
  );

  useEffect(() => {
    setSelectedIssueSlug(uniqueIssueTags[0]?.slug as string);
    setSelectedOfficeSlug(uniqueOffices[0]?.slug as string);
  }, [uniqueIssueTags, uniqueOffices]);

  const filteredNotes = useMemo(
    () =>
      notes
        .filter(
          (note) =>
            note.politician.upcomingRace?.office?.slug === selectedOfficeSlug
        )
        .filter((note) =>
          note.issueTags.map((t) => t.slug).includes(selectedIssueSlug)
        )
        .filter((note) => !!note.notes[language]),
    [notes, selectedOfficeSlug, selectedIssueSlug, language]
  );

  console.log(filteredNotes);

  if (notesQuery.isLoading || electionQuery.isLoading)
    return (
      <div className={styles.center}>
        <LoaderFlag />
      </div>
    );

  return (
    <div className={styles.container}>
      <h2>Voting Guides</h2>
      <div className={styles.optionsContainer}>
        <Select
          onChange={(e) => setSelectedOfficeSlug(e.target.value)}
          value={selectedOfficeSlug}
          options={uniqueOffices.map((office) => ({
            value: office?.slug as string,
            label: office?.name as string,
          }))}
        />
        <Select
          onChange={(e) => setLanguage(e.target.value as Language)}
          value={language}
          options={LANGUAGES.map((l) => ({
            value: l.code,
            label: l.display,
          }))}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.issuesContainer}>
          <div className={styles.issuesContent}>
            <h2>Issues</h2>
            <ul>
              {uniqueIssueTags.map((tag) => (
                <li key={tag.id}>
                  <button
                    className={styles.issueButton}
                    disabled={selectedIssueSlug === tag.slug}
                    onClick={() => setSelectedIssueSlug(tag.slug)}
                    id={tag.id}
                  >
                    {tag.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          {filteredNotes.map((note) => (
            <PoliticianNote
              key={note.id}
              politician={note.politician as Partial<PoliticianResult>}
              notes={note.notes}
              language={language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { PoliticianNotes };
