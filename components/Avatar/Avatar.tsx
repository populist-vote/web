import { ImageWithFallback } from "components";
import React, { useMemo, CSSProperties } from "react";
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

export interface AvatarProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  size: number;
  badge?: BadgeProps;
  name?: string;
  round?: boolean;
  onClick?: () => void;
}

export interface PartyAvatarProps extends AvatarProps {
  party: PoliticalParty;
  badgeSize?: string;
  badgeFontSize?: string;
  href?: string;
}

function Badge(props: BadgeProps): JSX.Element {
  const { text, background, size, fontSize } = props;

  const styleVars: CSSProperties & {
    "--avatar-size": string,
    "--avatar-font-size": string,
    "--avatar-background": string | undefined,
  } = {
    [`--avatar-size`]: size,
    [`--avatar-font-size`]: fontSize,
    [`--avatar-background`]: background
  };

  return (
    <div className={styles.badgeWrapper} style={styleVars}>
      <span className={styles.badgeText}>{text}</span>
    </div>
  );
}

function Avatar(props: AvatarProps): JSX.Element {
  const { badge } = props;

  return (
    <div style={{ display: "inline" }}>
      <div className={styles.container}>
        <ImageWithFallback
          src={props.src || props.fallbackSrc}
          fallbackSrc={props.fallbackSrc as string}
          width={props.size}
          height={props.size}
          className={styles.imageContainer}
        />
        {badge && <Badge {...badge} />}
      </div>
    </div>
  );
}

function PartyAvatar({
  party,
  badgeSize = "1.25rem",
  badgeFontSize = "0.75rem",
  src,
  fallbackSrc = PERSON_FALLBACK_IMAGE_URL,
  ...rest
}: PartyAvatarProps): JSX.Element {
  const partyColor = useMemo(() => getPartyColor(party), [party]);

  const badge = {
    background: partyColor,
    text: party.slice(0, 1).toUpperCase(),
    size: badgeSize,
    fontSize: badgeFontSize,
  };

  return <Avatar badge={badge} src={src} fallbackSrc={fallbackSrc} {...rest} />;
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
