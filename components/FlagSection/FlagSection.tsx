import React from "react";
import Link from "next/link";
import styles from "./FlagSection.module.scss";
import clsx from "clsx";
import { Button } from "components";
import { useRouter } from "next/router";
import { useAuth } from "hooks/useAuth";
import { SystemRoleType } from "generated";

export type FlagColor =
  | "salmon"
  | "green"
  | "yellow"
  | "aqua"
  | "violet"
  | "grey";

interface FlagSectionProps {
  label: string;
  children: React.ReactNode;
  color?: FlagColor;
  size?: string;
  hideFlagForMobile?: boolean;
  style?: React.CSSProperties;
}

function FlagSection(props: FlagSectionProps) {
  const {
    label,
    children,
    color,
    size,
    hideFlagForMobile = false,
    style,
  } = props;
  const router = useRouter();
  const createVideoUrl = `${router.asPath}/create-video`;

  const styleClasses = clsx(styles.container, {
    [styles.hideFlagForMobile as string]: hideFlagForMobile,
    ...(!!color ? { [styles[color] as string]: true } : {}),
    [styles[size ?? "large"] as string]: true,
  });

  const { user } = useAuth();
  const isStaff = user?.systemRole >= SystemRoleType.Staff;

  return (
    <div style={style} className={styleClasses}>
      <header className={styles.header}>
        <span className={styles.sectionTitle}>{label}</span>
        {router.pathname.includes("bill") && isStaff && (
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
