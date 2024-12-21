/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeReference } from "components/TypeReference/TypeReference";
import styles from "./QueriesDoc.module.scss";
import Divider from "components/Divider/Divider";

interface QueryArg {
  name: string;
  type: any;
  description?: string;
}

interface Query {
  name: string;
  description?: string;
  args: QueryArg[];
  type: any;
}

interface Props {
  queries: Query[];
}

export function QueriesDoc({ queries }: Props) {
  return (
    <div className={styles.container}>
      <h1>Queries</h1>
      <div className={styles.queryList}>
        {queries.map((query) => (
          <section
            key={query.name}
            id={query.name}
            className={styles.query}
            data-section-id={query.name}
          >
            <h2>{query.name}</h2>
            {query.description && <p>{query.description}</p>}
            <div className={styles.signature}>
              <code>
                {query.name}
                {query.args.length > 0 && (
                  <span className={styles.args}>
                    (
                    {query.args.map((arg, i) => (
                      <span key={arg.name}>
                        {i > 0 && ", "}
                        {arg.name}: <TypeReference type={arg.type} />
                      </span>
                    ))}
                    )
                  </span>
                )}
                : <TypeReference type={query.type} />
              </code>
            </div>
            {query.args.length > 0 && (
              <div className={styles.arguments}>
                <h3>Arguments</h3>
                {query.args.map((arg) => (
                  <div key={arg.name} className={styles.argument}>
                    <code>{arg.name}</code>
                    <span className={styles.type}>
                      <TypeReference type={arg.type} />
                    </span>
                    {arg.description && <p>{arg.description}</p>}
                  </div>
                ))}
              </div>
            )}
            <Divider />
          </section>
        ))}
      </div>
    </div>
  );
}
