/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeReference } from "components/TypeReference/TypeReference";
import styles from "./MutationsDoc.module.scss";

interface MutationArg {
  name: string;
  type: any;
  description?: string;
  defaultValue?: string;
}

interface Mutation {
  name: string;
  description?: string;
  args: MutationArg[];
  type: any;
  deprecationReason?: string;
}

interface Props {
  mutations: Mutation[];
}

export function MutationsDoc({ mutations }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mutations</h1>

      <div className={styles.mutationList}>
        {mutations.map((mutation) => (
          <section
            key={mutation.name}
            id={mutation.name}
            className={styles.mutation}
          >
            <div className={styles.header}>
              <h2 className={styles.name}>{mutation.name}</h2>
              {mutation.deprecationReason && (
                <span className={styles.deprecated}>
                  Deprecated: {mutation.deprecationReason}
                </span>
              )}
            </div>

            {mutation.description && (
              <p className={styles.description}>{mutation.description}</p>
            )}

            <div className={styles.signature}>
              <code>
                mutation {mutation.name}
                {mutation.args.length > 0 && (
                  <span className={styles.args}>
                    (
                    {mutation.args.map((arg, i) => (
                      <span key={arg.name}>
                        {i > 0 && ", "}
                        {arg.name}
                        <span className={styles.argType}>
                          : <TypeReference type={arg.type} />
                        </span>
                        {arg.defaultValue && (
                          <span className={styles.defaultValue}>
                            = {arg.defaultValue}
                          </span>
                        )}
                      </span>
                    ))}
                    )
                  </span>
                )}
              </code>
            </div>

            <div className={styles.returnType}>
              <span className={styles.returns}>Returns: </span>
              <TypeReference type={mutation.type} />
            </div>

            {mutation.args.length > 0 && (
              <div className={styles.arguments}>
                <h3>Arguments</h3>
                {mutation.args.map((arg) => (
                  <div key={arg.name} className={styles.argument}>
                    <div className={styles.argumentHeader}>
                      <code className={styles.argumentName}>{arg.name}</code>
                      <TypeReference type={arg.type} />
                      {arg.defaultValue && (
                        <span className={styles.defaultValue}>
                          Default: {arg.defaultValue}
                        </span>
                      )}
                    </div>
                    {arg.description && (
                      <p className={styles.argumentDescription}>
                        {arg.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
