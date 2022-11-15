import { ImageWithFallback, NoteIcon } from "components";
import React, { useMemo, CSSProperties, EventHandler } from "react";
import { FaPlus } from "react-icons/fa";
import { StarYellowDarkIcon, StarGreyDarkIcon } from "components/Icons";

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
import clsx from "clsx";
import { titleCase } from "utils/strings";

interface BadgeProps {
  background?: string;
  color?: string;
  text?: string;
  title?: string;
  size: string;
  fontSize: string;
}

type IconType = "plus" | "note" | "star";

interface IconProps {
  type: IconType;
  background?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  size: string;

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

interface AvatarProps {
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
  labelLeft?: LabelLeftProps;
  opaque?: boolean;
  onClick?: () => void;
}

interface PartyAvatarProps extends AvatarProps {
  party?: PoliticalParty;
  badgeSize?: string;
  badgeFontSize?: string;
  href?: string;
  hasNote?: boolean;
  isEndorsement?: boolean;
  iconSize?: string;
  iconType?: IconType;
  handleEndorseCandidate?: EventHandler<ClickEvent | any>;
  handleUnendorseCandidate?: EventHandler<ClickEvent | any>;
  handleAddNote?: EventHandler<ClickEvent | any>;
  readOnly?: boolean;
}

interface LabelLeftProps {
  color?: string;
  background?: string;
  text: string | null;
  icon?: React.ReactNode;
}

function LabelLeft(props: LabelLeftProps): JSX.Element | null {
  const { text, color, background, icon } = props;

  const styleVars: CSSProperties & {
    "--color": string | undefined;
    "--background": string | undefined;
  } = {
    [`--color`]: color,
    [`--background`]: background,
  };

  if (!text) return null;

  return (
    <div className={styles.labelLeftWrapper} style={styleVars}>
      {!!icon && icon}
      <span className={styles.labelText}>{text}</span>
    </div>
  );
}

function Badge(props: BadgeProps): JSX.Element {
  const { text, title, background, color, size, fontSize } = props;

  const styleVars: CSSProperties & {
    "--badge-size": string;
    "--badge-font-size": string;
    "--badge-background": string | undefined;
    "--badge-color": string | undefined;
  } = {
    [`--badge-size`]: size,
    [`--badge-font-size`]: fontSize,
    [`--badge-background`]: background,
    [`--badge-color`]: color,
  };

  return (
    <div className={styles.badgeWrapper} style={styleVars} title={title}>
      <span className={styles.badgeText}>{text?.slice(0, 1)}</span>
    </div>
  );
}

const IconImage = ({
  type,
  isEndorsement,
  size,
}: {
  type: IconType;
  isEndorsement?: boolean;
  size?: string;
}) => {
  switch (type) {
    case "note":
      return <NoteIcon />;
    case "plus":
      return <FaPlus size={size} />;
    case "star":
      return isEndorsement ? <StarYellowDarkIcon /> : <StarGreyDarkIcon />;
  }
};

const menuItemClassName: unknown = ({ hover }: { hover: boolean }) =>
  hover ? menuStyles.menuItemHover : menuStyles.menuItem;

function IconMenu(props: IconMenuProps): JSX.Element {
  const { background, size, type, color } = props.icon;

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
    "--icon-cursor": string;
  } = {
    ["--icon-wrapper-size"]: type === "note" ? "auto" : size,
    ["--icon-background"]: type === "note" ? "none" : background,
    ["--icon-size"]: size,
    ["--icon-color"]: color,
    ["--icon-cursor"]: !!handleEndorseCandidate ? "pointer" : "default",
  };

  if (readOnly && type === "plus") return <></>;

  const $icon = (
    <div className={styles.iconInner}>
      <div className={styles.iconWrapper}>
        <IconImage type={type} isEndorsement={isEndorsement} />
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
    borderWidth = "3px",
    fallbackSrc = PERSON_FALLBACK_IMAGE_URL,
    hasIconMenu,
    iconMenuProps,
    href,
    handleIconClick,
    labelLeft,
    opaque = false,
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

  const cx = clsx(styles.imageContainer, {
    [styles.opaque as string]: opaque,
  });

  const $avatarImage = (
    <ImageWithFallback
      src={props.src || fallbackSrc}
      fallbackSrc={fallbackSrc}
      width={props.size}
      height={props.size}
      className={cx}
      alt={props.alt}
    />
  );

  return (
    <div
      style={{
        display: "inline",
        width: props.size,
        height: props.size,
        overflow: "visible",
        ...styleVars,
      }}
    >
      <div className={styles.container}>
        {href ? (
          <div className={styles.avatarLink}>
            <Link href={href} passHref>
              <div>{$avatarImage}</div>
            </Link>
          </div>
        ) : (
          $avatarImage
        )}
        {hasIconMenu && iconMenuProps && (
          <IconMenu {...iconMenuProps} handleIconClick={handleIconClick} />
        )}
        {badge && <Badge {...badge} />}
        {labelLeft && <LabelLeft {...labelLeft} />}
      </div>
    </div>
  );
}

function PartyAvatar({
  party = PoliticalParty.Unknown,
  badgeSize = "1.25rem",
  badgeFontSize = "0.75rem",
  iconSize = "1.25rem",
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
  labelLeft,
  opaque = false,
  ...rest
}: PartyAvatarProps): JSX.Element {
  const { background, text: color } = useMemo(
    () => getPartyColors(party),
    [party]
  );
  const badge = {
    background,
    color,
    text: (party || "UNKNOWN").toUpperCase(),
    title: titleCase((party || "UNKNOWN").replaceAll("_", " ")),
    size: badgeSize,
    fontSize: badgeFontSize,
  };

  const iconStyleVars: CSSProperties & {
    "--icon-right-position": string;
    "--icon-top-position": string;
  } = {
    ["--icon-right-position"]: iconType === "note" ? "-.2rem" : "0",
    ["--icon-top-position"]: iconType === "note" ? "-.2rem" : "0",
  };

  const icon = {
    background:
      isEndorsement && iconType === "star"
        ? "var(--yellow)"
        : "var(--grey-light)",
    color:
      isEndorsement && iconType === "star"
        ? "var(--yellow-dark)"
        : "var(--grey-darker)",
    type: iconType,
    size: iconSize,
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
    <div style={iconStyleVars} className={styles.avatarContainer}>
      <Avatar
        borderColor={isEndorsement ? "var(--yellow)" : undefined}
        badge={badge}
        labelLeft={labelLeft}
        hasIconMenu={hasIconMenu}
        iconMenuProps={iconMenuProps}
        src={src}
        fallbackSrc={fallbackSrc}
        opaque={opaque}
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

type BadgeColors = {
  background: string;
  text: string;
};

function getPartyColors(
  party: PoliticalParty = PoliticalParty.Unknown
): BadgeColors {
  switch (party) {
    case PoliticalParty.Democratic:
      return {
        background: "var(--blue)",
        text: "var(--white)",
      };
    case PoliticalParty.DemocraticFarmerLabor:
      return {
        background: "var(--blue)",
        text: "var(--white)",
      };
    case PoliticalParty.Republican:
      return {
        background: "var(--red)",
        text: "var(--white)",
      };
    case PoliticalParty.Green:
      return {
        background: "var(--green-support)",
        text: "var(--white)",
      };
    case PoliticalParty.LegalMarijuanaNow:
      return {
        background: "var(--green-support)",
        text: "var(--white)",
      };
    case PoliticalParty.GrassrootsLegalizeCannabis:
      return {
        background: "var(--green-support)",
        text: "var(--white)",
      };
    case PoliticalParty.Libertarian:
      return {
        background: "var(--yellow)",
        text: "var(--grey-darkest)",
      };
    case PoliticalParty.AmericanConstitution:
      return {
        background: "var(--red)",
        text: "var(--white)",
      };
    case PoliticalParty.Constitution:
      return {
        background: "var(--red)",
        text: "var(--white)",
      };
    case PoliticalParty.Unknown:
      return {
        background: "var(--grey-light)",
        text: "var(--grey-darkest)",
      };
    case PoliticalParty.Unaffiliated:
      return {
        background: "var(--grey-light)",
        text: "var(--grey-darkest)",
      };
    case PoliticalParty.SocialistWorkers:
      return {
        background: "var(--red)",
        text: "var(--white)",
      };
    default:
      return {
        background: "var(--purple)",
        text: "var(--white)",
      };
  }
}

export type { IconType, AvatarProps, PartyAvatarProps };
export { Avatar, PartyAvatar, OrganizationAvatar, getPartyColors };
