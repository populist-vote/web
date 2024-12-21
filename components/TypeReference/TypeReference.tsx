import Link from "next/link";
import styles from "./TypeReference.module.scss";

interface TypeRef {
  kind: string;
  name?: string;
  ofType?: TypeRef;
}

interface TypeReferenceProps {
  type: TypeRef;
}

export function TypeReference({ type }: TypeReferenceProps) {
  // Handle non-null types (Type!)
  if (type.kind === "NON_NULL") {
    return (
      <span className={styles.typeWrapper}>
        <TypeReference type={type.ofType!} />
        <span className={styles.required}>!</span>
      </span>
    );
  }

  // Handle list types ([Type])
  if (type.kind === "LIST") {
    return (
      <span className={styles.typeWrapper}>
        [<TypeReference type={type.ofType!} />]
      </span>
    );
  }

  // Handle scalar types (don't link these)
  const isScalar = ["String", "Int", "Float", "Boolean", "ID"].includes(
    type.name ?? ""
  );

  // Basic named type
  if (isScalar) {
    return <span className={styles.scalar}>{type.name}</span>;
  }

  // Link to type definition for non-scalars
  return (
    <Link href={`/docs/api/types#${type.name}`} className={styles.typeLink}>
      {type.name}
    </Link>
  );
}
