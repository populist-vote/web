import { ImageWithFallback } from "components";
import React, { useMemo } from "react";
import {
  ORGANIZATION_FALLBACK_IMAGE_URL,
  PERSON_FALLBACK_IMAGE_URL,
} from "utils/constants";
import { PoliticalParty } from "../../generated";
import styles from "./Avatar.module.scss";
import styled, { css } from "styled-components";

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

interface BadgeWrapperProps {
  background: BadgeProps["background"];
  size: string;
  fontSize: string;
}

const BadgeWrapper = styled.span<BadgeWrapperProps>(
  ({ background, size, fontSize }) => {
    return css`
      position: absolute;
      bottom: 3px;
      right: 0;
      border-radius: 50px;
      width: ${size};
      height: ${size};
      font-size: ${fontSize};
      text-transform: uppercase;
      color: var(--white);
      background: ${background || "var(--gray)"};
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    `;
  }
);

const BadgeText = styled.span`
  align-self: center;
  margin: auto;
  justify-content: center;
  text-align: center;
`;

function Badge(props: BadgeProps): JSX.Element {
  const { text, background, size, fontSize } = props;
  return (
    <BadgeWrapper size={size} fontSize={fontSize} background={background}>
      <BadgeText>{text}</BadgeText>
    </BadgeWrapper>
  );
}

const Wrapper = styled.div`
  display: inline;
`;

function Avatar(props: AvatarProps): JSX.Element {
  const { badge } = props;

  return (
    <Wrapper>
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
    </Wrapper>
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
