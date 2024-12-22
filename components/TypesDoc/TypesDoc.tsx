/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeReference } from "components/TypeReference/TypeReference";
import styles from "../ApiDoc/ApiDoc.module.scss";

interface Field {
  name: string;
  description?: string;
  type: any;
  args: any[];
}

interface Type {
  name: string;
  description?: string;
  kind: string;
  fields?: Field[];
  enumValues?: Array<{
    name: string;
    description?: string;
  }>;
}

interface Props {
  types: Type[];
}

export function TypesDoc({ types }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Types</h1>
      <div className={styles.itemList}>
        {types.map((type) => (
          <section key={type.name} id={type.name} className={styles.item}>
            <div className={styles.header}>
              <h2 className={styles.name}>{type.name}</h2>
            </div>
            {type.description && (
              <p className={styles.description}>{type.description}</p>
            )}

            {type.kind === "ENUM" ? (
              <div className={styles.enumValues}>
                <h3>Values</h3>
                {type.enumValues?.map((enumValue) => (
                  <div key={enumValue.name} className={styles.enumValue}>
                    <code>{enumValue.name}</code>
                    {enumValue.description && <p>{enumValue.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              type.fields && (
                <div className={styles.fields}>
                  <h3>Fields</h3>
                  {type.fields.map((field) => (
                    <div key={field.name} className={styles.field}>
                      <div className={styles.fieldHeader}>
                        <code>{field.name}</code>
                        <span className={styles.type}>
                          <TypeReference type={field.type} />
                        </span>
                      </div>
                      {field.description && <p>{field.description}</p>}
                      {field.args.length > 0 && (
                        <div className={styles.arguments}>
                          <h4>Arguments</h4>
                          {field.args.map((arg) => (
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
                    </div>
                  ))}
                </div>
              )
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
