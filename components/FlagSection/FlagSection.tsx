import React from "react";
import Link from "next/link";
import styles from "./FlagSection.module.scss";
import clsx from "clsx";
import { Button } from "components";
import { useRouter } from "next/router";
import { useAuth } from "hooks/useAuth";
import { isPremium } from "utils/user";

export type FlagColor = "salmon" | "green" | "yellow" | "aqua" | "violet";

interface FlagSectionProps {
  label: string;
  children: React.ReactNode;
  color?: FlagColor;
  hideFlagForMobile?: boolean;
  style?: React.CSSProperties;
}

function FlagSection(props: FlagSectionProps): JSX.Element {
  const { label, children, color, hideFlagForMobile = false, style } = props;
  const router = useRouter();
  const createVideoUrl = `${router.asPath}/create-video`;

  const styleClasses = clsx(styles.container, {
    [styles.hideFlagForMobile as string]: hideFlagForMobile,
    ...(!!color ? { [styles[color] as string]: true } : {}),
  });

  const { user } = useAuth();
  const isPremiumUser = isPremium(user);

  return (
    <div style={style} className={styleClasses}>
      <header className={styles.header}>
        <span className={styles.sectionTitle}>{label}</span>
        {router.pathname.includes("bill") && isPremiumUser && (
          <Link href={createVideoUrl}>
            <Button
              variant="primary"
              size="medium"
              label="Generate Video Content"
              width="16rem"
            />
          </Link>
        )}
      </header>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export { FlagSection };
