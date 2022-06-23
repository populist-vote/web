import { ImageWithFallback, NoteIcon } from "components";
import React, { useMemo, CSSProperties, EventHandler } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
import {
  ORGANIZATION_FALLBACK_IMAGE_URL,
  PERSON_FALLBACK_IMAGE_URL,
} from "utils/constants";
import { PoliticalParty } from "../../generated";
import styles from "./Avatar.module.scss";
import {
  Menu,
  MenuItem,
  MenuButton,
  ClickEvent,
  MenuItemTypeProp,
} from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import menuStyles from "./IconMenu.module.scss";
import Link from "next/link";

interface BadgeProps {
  background?: string;
  text?: string;
  size: string;
  fontSize: string;
}

export type IconType = "plus" | "note" | "star";

interface IconProps {
  type: IconType;
  background?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  size: string;
  innerSize: string;
  color: string;
  ref?: React.Ref<HTMLButtonElement>;
}

interface IconMenuProps {
  isEndorsement: boolean;
  hasNote: boolean;
  handleEndorseCandidate?: EventHandler<ClickEvent | any>;
  handleUnendorseCandidate?: EventHandler<ClickEvent | any>;
  handleAddNote?: EventHandler<ClickEvent | any>;
  handleIconClick?: EventHandler<ClickEvent | any>;
  icon: IconProps;
  readOnly: boolean;
}

export interface AvatarProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  size: number;
  badge?: BadgeProps;
  borderColor?: string;
  borderWidth?: string;
  hasIconMenu?: boolean;
  handleIconClick?: EventHandler<ClickEvent | any>;
  iconMenuProps?: IconMenuProps;
  name?: string;
  round?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface PartyAvatarProps extends AvatarProps {
  party?: PoliticalParty;
  badgeSize?: string;
  badgeFontSize?: string;
  href?: string;
  hasNote?: boolean;
  isEndorsement?: boolean;
  iconSize?: string;
  iconInnerSize?: string;
  iconType?: IconType;
  handleEndorseCandidate?: EventHandler<ClickEvent | any>;
  handleUnendorseCandidate?: EventHandler<ClickEvent | any>;
  handleAddNote?: EventHandler<ClickEvent | any>;
  readOnly?: boolean;
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

const IconImage = ({ type }: { type: IconType }) => {
  switch (type) {
    case "note":
      return <NoteIcon />;
    case "plus":
      return <FaPlus />;
    case "star":
      return <FaStar />;
  }
};

const iconSize = (type: IconType) => {
  switch (type) {
    case "note":
      return "100%";
    case "plus":
      return "100%";
    case "star":
      return "150%";
  }
};

const menuItemClassName: unknown = ({ hover }: { hover: boolean }) =>
  hover ? menuStyles.menuItemHover : menuStyles.menuItem;

function IconMenu(props: IconMenuProps): JSX.Element {
  const { background, size, type, color, innerSize } = props.icon;

  const {
    isEndorsement = false,
    hasNote = false,
    handleEndorseCandidate,
    handleUnendorseCandidate,
    handleAddNote,
    handleIconClick,
    readOnly = true,
  } = props;

  const styleVars: CSSProperties & {
    "--icon-wrapper-size": string;
    "--icon-background": string | undefined;
    "--icon-size": string;
    "--icon-color": string;
    "--icon-inner-size": string;
  } = {
    [`--icon-wrapper-size`]: type === "note" ? "auto" : size,
    [`--icon-background`]: type === "note" ? "none" : background,
    [`--icon-size`]: iconSize(type),
    [`--icon-color`]: color,
    [`--icon-inner-size`]: innerSize,
  };

  if (readOnly && type === "plus") return <></>;

  const $icon = (
    <div className={styles.iconInner}>
      <div className={styles.iconWrapper}>
        <IconImage type={type} />
      </div>
    </div>
  );

  return !!handleIconClick ? (
    <button
      className={`${styles.iconOuter} iconOnly`}
      style={styleVars}
      onClick={handleIconClick}
    >
      {$icon}
    </button>
  ) : (
    <Menu
      menuClassName={menuStyles.menu}
      menuButton={
        <MenuButton
          className={`${styles.iconOuter} menu`}
          style={styleVars}
          disabled={readOnly}
        >
          {$icon}
        </MenuButton>
      }
      transition
    >
      {isEndorsement ? (
        <MenuItem
          onClick={handleUnendorseCandidate}
          className={menuItemClassName as MenuItemTypeProp}
        >
          Unendorse
        </MenuItem>
      ) : (
        <MenuItem
          onClick={handleEndorseCandidate}
          className={menuItemClassName as MenuItemTypeProp}
        >
          Endorse
        </MenuItem>
      )}

      <MenuItem
        onClick={handleAddNote}
        className={menuItemClassName as MenuItemTypeProp}
      >
        {hasNote ? "Edit Note" : "Add Note"}
      </MenuItem>
    </Menu>
  );
}

function Avatar(props: AvatarProps): JSX.Element {
  const {
    badge,
    borderColor,
    borderWidth = "2px",
    fallbackSrc = PERSON_FALLBACK_IMAGE_URL,
    hasIconMenu,
    iconMenuProps,
    href,
    handleIconClick,
  } = props;

  const styleVars: CSSProperties & {
    "--border-color": string;
    "--border-width": string;
    "--border-style": string;
  } = {
    [`--border-color`]: borderColor || "transparent",
    [`--border-width`]: borderColor ? borderWidth : "0",
    [`--border-style`]: borderColor ? "solid" : "none",
  };

  const $avatarImage = (
    <ImageWithFallback
      src={props.src || fallbackSrc}
      fallbackSrc={fallbackSrc}
      width={props.size}
      height={props.size}
      className={styles.imageContainer}
      alt={props.alt}
    />
  );

  return (
    <div style={{ display: "inline", width: "max-content", ...styleVars }}>
      <div className={styles.container}>
        {href ? (
          <div className={styles.avatarLink}>
            <Link href={href} passHref>
              {$avatarImage}
            </Link>
          </div>
        ) : (
          $avatarImage
        )}
        {hasIconMenu && iconMenuProps && (
          <IconMenu {...iconMenuProps} handleIconClick={handleIconClick} />
        )}
        {badge && <Badge {...badge} />}
      </div>
    </div>
  );
}

function PartyAvatar({
  party = PoliticalParty.Unknown,
  badgeSize = "1.25rem",
  badgeFontSize = "0.75rem",
  iconSize = "1.25rem",
  iconInnerSize = "100%",
  iconType = "plus",
  src,
  fallbackSrc = PERSON_FALLBACK_IMAGE_URL,
  hasIconMenu = false,
  isEndorsement = false,
  hasNote = false,
  handleEndorseCandidate,
  handleUnendorseCandidate,
  handleAddNote,
  readOnly = true,
  ...rest
}: PartyAvatarProps): JSX.Element {
  const partyColor = useMemo(() => getPartyColor(party), [party]);
  const badge = {
    background: partyColor,
    text: (party || "UNKNOWN").slice(0, 1).toUpperCase(),
    size: badgeSize,
    fontSize: badgeFontSize,
  };

  const iconStyleVars: CSSProperties & {
    "--icon-right-position": string;
  } = {
    ["--icon-right-position"]: iconType === "note" ? "-.5rem" : "0",
  };

  const icon = {
    background:
      isEndorsement && iconType === "star" ? "var(--yellow)" : "var(--grey)",
    color:
      isEndorsement && iconType === "star"
        ? "var(--yellow-dark)"
        : "var(--grey-darker)",
    type: iconType,
    size: iconSize,
    innerSize: iconInnerSize,
  };

  const iconMenuProps = {
    icon: icon,
    isEndorsement,
    hasNote,
    handleUnendorseCandidate,
    handleEndorseCandidate,
    handleAddNote,
    readOnly,
  };

  return (
    <div style={iconStyleVars}>
      <Avatar
        borderColor={isEndorsement ? "var(--yellow)" : undefined}
        badge={badge}
        hasIconMenu={hasIconMenu}
        iconMenuProps={iconMenuProps}
        src={src}
        fallbackSrc={fallbackSrc}
        {...rest}
      />
    </div>
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
    case PoliticalParty.Libertarian:
      return "var(--aqua)";
    default:
      return "var(--purple)";
  }
}

export { Avatar, PartyAvatar, OrganizationAvatar };
