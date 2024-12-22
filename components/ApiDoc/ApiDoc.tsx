import { TypeReference } from "components/TypeReference/TypeReference";
import styles from "./ApiDoc.module.scss";
import Divider from "components/Divider/Divider";

interface BaseArg {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  description?: string;
  defaultValue?: string;
}

interface BaseItem {
  name: string;
  description?: string;
  args: BaseArg[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  deprecationReason?: string;
}

interface Props {
  items: BaseItem[];
  title: string;
  type: "query" | "mutation";
}

export function ApiDoc({ items, title, type }: Props) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.itemList}>
        {items.map((item) => (
          <section
            key={item.name}
            id={item.name}
            className={styles.item}
            data-section-id={item.name}
          >
            {/* Header with name and deprecation notice */}
            <div className={styles.header}>
              <h2 className={styles.name}>{item.name}</h2>
              {item.deprecationReason && (
                <span className={styles.deprecated}>
                  Deprecated: {item.deprecationReason}
                </span>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className={styles.description}>{item.description}</p>
            )}

            {/* Signature */}
            <div className={styles.signature}>
              <code>
                {type === "mutation"}
                <span className={styles.method}>{item.name}</span>
                {item.args.length > 0 && (
                  <span className={styles.args}>
                    <span className={styles.parens}>(</span>
                    {item.args.map((arg, i) => (
                      <span key={arg.name}>
                        {i > 0 && ", "}
                        <span className={styles.argName}>{arg.name}</span>
                        : <TypeReference type={arg.type} />
                        {arg.defaultValue && (
                          <span className={styles.defaultValue}>
                            {" = "}
                            {arg.defaultValue}
                          </span>
                        )}
                      </span>
                    ))}
                    <span className={styles.parens}>)</span>
                  </span>
                )}
                {type === "query" && (
                  <span>
                    : <TypeReference type={item.type} />
                  </span>
                )}
              </code>
            </div>

            {/* Return type (for mutations) */}
            {type === "mutation" && (
              <div className={styles.returnType}>
                <span className={styles.returns}>Returns: </span>
                <TypeReference type={item.type} />
              </div>
            )}

            {/* Arguments */}
            {item.args.length > 0 && (
              <div className={styles.arguments}>
                <h3 className={styles.argumentsTitle}>Arguments</h3>
                {item.args.map((arg) => (
                  <div key={arg.name} className={styles.argument}>
                    <div className={styles.argumentHeader}>
                      <code>{arg.name}</code>
                      <span className={styles.type}>
                        <TypeReference type={arg.type} />
                      </span>
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
            <Divider />
          </section>
        ))}
      </div>
    </div>
  );
}
