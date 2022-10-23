import clsx from "clsx";
import Link from "next/link";
import styles from "./HomePageButton.module.scss";

function HomePageButton({
  href,
  className,
  label,
}: {
  href: string;
  className: string;
  label: string;
}) {
  return (
    <Link href={href} passHref>
      <div className={clsx(styles.container, styles[className])}>{label}</div>
    </Link>
  );
}

export { HomePageButton };
