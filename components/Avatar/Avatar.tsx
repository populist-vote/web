import { ImageWithFallback, NoteIcon } from "components";
import React, { useMemo, CSSProperties } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
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
  color: string;
}

export interface AvatarProps {
  src: string;
  fallbackSrc?: string;
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
  iconType?: IconTypes;
  onIconClick?: () => void;
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

const IconImage = ({ type }: { type: IconTypes }) => {
  switch (type) {
    case "note":
      return <NoteIcon />;
    case "plus":
      return <FaPlus />;
    case "star":
      return <FaStar />;
  }
};

const iconSize = (type: IconTypes) => {
  switch (type) {
    case "note":
      return "100%";
    case "plus":
      return "65%";
    case "star":
      return "75%";
  }
};

function Icon(props: IconProps): JSX.Element {
  const { background, size, type, color, onClick } = props;

  const styleVars: CSSProperties & {
    "--icon-wrapper-size": string;
    "--icon-background": string | undefined;
    "--icon-size": string;
    "--icon-color": string;
  } = {
    [`--icon-wrapper-size`]: size,
    [`--icon-background`]: type === "note" ? "none" : background,
    [`--icon-size`]: iconSize(type),
    [`--icon-color`]: color,
  };

  return (
    <div className={styles.iconOuter} style={styleVars}>
      <div className={styles.iconInner}>
        <button
          className={styles.iconWrapper}
          onClick={onClick}
          onKeyUp={(e) => e.key === "Enter" && onClick && onClick()}
        >
          <IconImage type={type} />
        </button>
      </div>
    </div>
  );
}

function Avatar(props: AvatarProps): JSX.Element {
  const {
    badge,
    icon,
    borderColor,
    fallbackSrc = PERSON_FALLBACK_IMAGE_URL,
  } = props;

  const styleVars: CSSProperties & {
    "--border-color": string;
    "--border-width": string;
    "--border-style": string;
  } = {
    [`--border-color`]: borderColor || "transparent",
    [`--border-width`]: borderColor ? "2px" : "0",
    [`--border-style`]: borderColor ? "solid" : "none",
  };

  return (
    <div style={{ display: "inline", ...styleVars }}>
      <div className={styles.container}>
        <ImageWithFallback
          src={props.src || fallbackSrc}
          fallbackSrc={fallbackSrc}
          width={props.size}
          height={props.size}
          className={styles.imageContainer}
          alt={props.alt}
        />
        {icon && <Icon {...icon} />}
        {badge && <Badge {...badge} />}
      </div>
    </div>
  );
}

function PartyAvatar({
  party = "UNKNOWN" as PoliticalParty,
  badgeSize = "1.25rem",
  badgeFontSize = "0.75rem",
  iconSize = "1.25rem",
  iconType = "plus",
  onIconClick,
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
    background:
      isEndorsed && iconType === "star" ? "var(--yellow)" : "var(--grey)",
    color:
      isEndorsed && iconType === "star"
        ? "var(--yellow-dark)"
        : "var(--grey-darker)",
    type: iconType,
    size: iconSize,
    onClick: onIconClick,
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

export function getPartyColor(
  party: PoliticalParty = PoliticalParty.Unknown
): string {
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

export { Avatar, PartyAvatar, OrganizationAvatar };
