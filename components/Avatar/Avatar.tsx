import { ImageWithFallback, Add, Note } from "components";
import React, { useMemo, CSSProperties } from "react";
import { /*FaPlus, FaPlusCircle,*/ FaStar } from "react-icons/fa";
import { default as classNames } from "classnames";
import {
  ORGANIZATION_FALLBACK_IMAGE_URL,
  PERSON_FALLBACK_IMAGE_URL,
} from "utils/constants";
import { PoliticalParty } from "../../generated";
import styles from "./Avatar.module.scss";

interface BadgeProps {
  background?: string;
  text?: string;
  size: string;
  fontSize: string;
}

type IconTypes = "plus" | "note" | "star";

interface IconProps {
  type: IconTypes;
  background?: string;
  onClick?: () => void;
  size: string;
  fontSize: string;
}

export interface AvatarProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  size: number;
  badge?: BadgeProps;
  borderColor?: string;
  icon?: IconProps;
  name?: string;
  round?: boolean;
  onClick?: () => void;
}

export interface PartyAvatarProps extends AvatarProps {
  party: PoliticalParty;
  badgeSize?: string;
  badgeFontSize?: string;
  href?: string;
  isEndorsed?: boolean;
  iconSize?: string;
  iconFontSize?: string;
  iconType?: IconTypes;
}

function Badge(props: BadgeProps): JSX.Element {
  const { text, background, size, fontSize } = props;

  const styleVars: CSSProperties & {
    "--avatar-size": string;
    "--avatar-font-size": string;
    "--avatar-background": string | undefined;
  } = {
    [`--avatar-size`]: size,
    [`--avatar-font-size`]: fontSize,
    [`--avatar-background`]: background,
  };

  return (
    <div className={styles.badgeWrapper} style={styleVars}>
      <span className={styles.badgeText}>{text}</span>
    </div>
  );
}

function Icon(props: IconProps): JSX.Element {
  const { background, size, fontSize, type } = props;

  const $icon = () => {
    switch (type) {
      case "note":
        return <Note />;
      case "plus":
        return <Add />;
      case "star":
        return <FaStar />;
      default:
        return <div></div>;
    }
  };

  const styleVars: CSSProperties & {
    "--avatar-size": string;
    "--avatar-font-size": string;
    "--avatar-background": string | undefined;
  } = {
    [`--avatar-size`]: size,
    [`--avatar-font-size`]: fontSize,
    [`--avatar-background`]: background,
  };

  return (
    <div className={styles.iconWrapper} style={styleVars}>
      <span className={styles.iconInner}>
        <$icon />
      </span>
    </div>
  );
}

function Avatar(props: AvatarProps): JSX.Element {
  const { badge, icon, borderColor } = props;

  const styleVars: CSSProperties & { "--bcol": string } = {
    [`--bcol`]: borderColor || "",
    borderColor,
    borderWidth: borderColor ?? "2px",
    borderStyle: borderColor ? "solid" : "none",
  };

  return (
    <div style={{ display: "inline" }}>
      <div className={styles.container}>
        <ImageWithFallback
          src={props.src || props.fallbackSrc}
          fallbackSrc={props.fallbackSrc as string}
          width={props.size}
          height={props.size}
          style={styleVars}
          className={classNames(styles.imageContainer, {
            [styles.border as string]: !!borderColor,
          })}
        />
        {icon && <Icon {...icon} />}
        {badge && <Badge {...badge} />}
      </div>
    </div>
  );
}

function PartyAvatar({
  party,
  badgeSize = "1.25rem",
  badgeFontSize = "0.75rem",
  iconSize = "1.25rem",
  iconFontSize = "0.75rem",
  iconType = "plus",
  src,
  fallbackSrc = PERSON_FALLBACK_IMAGE_URL,
  isEndorsed = false,
  ...rest
}: PartyAvatarProps): JSX.Element {
  const partyColor = useMemo(() => getPartyColor(party), [party]);

  const badge = {
    background: partyColor,
    text: party.slice(0, 1).toUpperCase(),
    size: badgeSize,
    fontSize: badgeFontSize,
  };

  const icon = {
    background: isEndorsed ? "var(--yellow)" : "var(--grey)",
    type: iconType,
    size: iconSize,
    fontSize: iconFontSize,
  };

  return (
    <Avatar
      borderColor={isEndorsed ? "var(--yellow)" : undefined}
      badge={badge}
      icon={icon}
      src={src}
      fallbackSrc={fallbackSrc}
      {...rest}
    />
  );
}

function OrganizationAvatar({
  src,
  fallbackSrc = ORGANIZATION_FALLBACK_IMAGE_URL,
  ...rest
}: AvatarProps) {
  return <Avatar src={src} fallbackSrc={fallbackSrc} {...rest} />;
}

function getPartyColor(party: PoliticalParty = PoliticalParty.Unknown): string {
  switch (party) {
    case PoliticalParty.Democratic:
      return "var(--blue)";
    case PoliticalParty.Republican:
      return "var(--red)";
    case PoliticalParty.Green:
      return "var(--green)";
    default:
      return "magenta";
  }
}

export { Avatar, getPartyColor, PartyAvatar, OrganizationAvatar };
