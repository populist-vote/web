import React, { useMemo } from "react";
import ReactAvatar, { ReactAvatarProps } from "react-avatar";
import styled, { css } from "styled-components";
import { PoliticalParty } from "../../generated";

interface BadgeProps {
  background?: string;
  text?: string;
  size: string;
  fontSize: string;
}

export interface AvatarProps extends ReactAvatarProps {
  badge?: BadgeProps;
}

export interface PartyAvatarProps extends ReactAvatarProps {
  party: PoliticalParty;
  badgeSize?: string;
  badgeFontSize?: string;
}

const AvatarWrapper = styled.div`
  position: relative;
  padding: 0;
  margin: auto;
  display: inline-flex;

  img {
    object-fit: cover;
  }
`;

interface BadgeWrapperProps {
  background: BadgeProps["background"];
  size: string;
  fontSize: string;
}

const BadgeWrapper = styled.div<BadgeWrapperProps>(
  ({ theme: { color, font }, background, size, fontSize }) => {
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

const BadgeText = styled.span(({ theme: { font } }) => {
  return css`
    align-self: center;
    margin: auto;
    justify-content: center;
    text-align: center;
  `;
});

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
  const { badge, name = "", round = true, ...rest } = props;

  const avatarProps = {
    ...rest,
    round, // default to round Avatars
    name,
    ...{ style: rest.onClick && { cursor: "pointer" } },
  };

  return (
    <Wrapper>
      <AvatarWrapper>
        <ReactAvatar {...avatarProps} />
        {badge && <Badge {...badge} />}
      </AvatarWrapper>
    </Wrapper>
  );
}

function PartyAvatar({
  party,
  badgeSize = "1.25rem",
  badgeFontSize = "0.75rem",
  ...rest
}: PartyAvatarProps): JSX.Element {
  const partyColor = useMemo(() => getPartyColor(party), [party]);

  const badge = {
    background: partyColor,
    text: party.slice(0, 1).toUpperCase(),
    size: badgeSize,
    fontSize: badgeFontSize,
  };
  return <Avatar badge={badge} {...rest} />;
}

function getPartyColor(
  party: PoliticalParty = PoliticalParty.Unknown
): string {
  switch (party) {
    case PoliticalParty.Democratic:
      return "var(--blue)";
    case PoliticalParty.Republican:
      return "var(--red)";
    default:
      return "purple";
  }
}

export {
  Avatar,
  getPartyColor,
  PartyAvatar
}
